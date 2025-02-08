import { NextResponse } from 'next/server';
import connectDB from '@/app/api/lib/db';
import Schedule from '@/app/api/lib/models/Schedule';
import Room from '@/app/api/lib/models/Room';
import Course from '@/app/api/lib/models/Course';
import { ratio } from 'fuzzball';
import Center from '@/app/api/lib/models/Center';
import Distributed_lectures from '@/app/api/lib/models/Distributed_lectures';

const isRoomAvailable = (bookedRooms, day, time, roomName) => {
    return !(bookedRooms.hasOwnProperty(`${day},${time}`)) || !bookedRooms[`${day},${time}`].includes(roomName);
};


const areSimilarNames = (name1, name2, threshold = 90 ) => {
    return ratio(name1.toLowerCase(), name2.toLowerCase()) >= threshold;
};

const distributeLectures = async (schedule, registeredStudents, lectureHalls, labs, bufferPercentage = 0.15) => {
    const assignments = [];
    const bookedRooms = {};

    // Sort rooms by capacity
    lectureHalls.sort((a, b) => b[2] - a[2]);
    labs.sort((a, b) => b[2] - a[2]);
    console.log(lectureHalls.length)
    const lecturesWithAttendance = [];
    for (const lecture of schedule) {
        const courseId = lecture.lecture;
        const lectureDay = lecture.day;
        const lectureTime = lecture.time;
        const lectureGroups = lecture.groups;

        for (const student of registeredStudents) {
            const { center, group, course, studentCount } = student;

            const groupsArray = String(group).split(',').map(g => g.trim());
            const groupExists = groupsArray.some(g => lectureGroups.has(g));

            if ( areSimilarNames(course, courseId) && groupExists) {  
                let expectedAttendance;
                if (Object.values(lectureGroups).every(g => g === "FTF")) {
                    expectedAttendance = studentCount;
                } else if (Object.values(lectureGroups).every(g => g === "VSR")) {
                    console.log(`Skipping lecture ${courseId} as all groups are VSR`);
                    continue;
                } else {
                    expectedAttendance = studentCount / 2;
                }

                lecturesWithAttendance.push({
                    lecture,
                    expectedAttendance,
                    center
                }); 
            }
        }
    }

    lecturesWithAttendance.sort((a, b) => b.expectedAttendance - a.expectedAttendance);

    for (const lectureData of lecturesWithAttendance) {
        const { lecture, expectedAttendance, center } = lectureData;
        const lectureDay = lecture.day;
        const lectureTime = lecture.time;
        const buffer = expectedAttendance * bufferPercentage;


        const availableRooms = lectureHalls.filter(hall => areSimilarNames(hall.center,center) && isRoomAvailable(bookedRooms, lectureDay, lectureTime, hall.name));
        console.log(availableRooms)
        let roundedAttendance = Math.ceil(expectedAttendance);
        for (const hall of availableRooms) {
            if (roundedAttendance <= 0) break;

            if (hall.capacity >= roundedAttendance - buffer) {
                assignments.push({
                    day: lectureDay,
                    time: lectureTime,
                    lecture: lecture.lecture,
                    professor: lecture.professor,
                    groups: lecture.groups,
                    hall: hall.name,
                    center,
                   
                });
                bookedRooms[`${lectureDay}-${lectureTime}`] = bookedRooms[`${lectureDay}-${lectureTime}`] || [];
                bookedRooms[`${lectureDay}-${lectureTime}`].push(hall.name);
                roundedAttendance = 0;
                break;
            } else {
                assignments.push({
                    day: lectureDay,
                    time: lectureTime,
                    lecture: lecture.lecture,
                    professor: lecture.professor,
                    groups: lecture.groups,
                    hall: hall.name,
                    center,
                
                });
                bookedRooms[`${lectureDay}-${lectureTime}`] = bookedRooms[`${lectureDay}-${lectureTime}`] || [];
                bookedRooms[`${lectureDay}-${lectureTime}`].push(hall.name);
                roundedAttendance -= hall.capacity;
            }
        }

        if (roundedAttendance > 0) {
            const availableLabs = labs.filter(lab => areSimilarNames(lab.center, center ) && isRoomAvailable(bookedRooms, lectureDay, lectureTime, lab.name));
            for (const lab of availableLabs) {
                if (roundedAttendance <= 0) break;

                if (lab.capacity >= roundedAttendance - buffer) {
                    assignments.push({
                        day: lectureDay,
                        time: lectureTime,
                        lecture: lecture.lecture,
                        professor: lecture.professor,
                        groups: lecture.groups,
                        hall: lab.name,
                        center,
                        
                    });
                    bookedRooms[`${lectureDay}-${lectureTime}`] = bookedRooms[`${lectureDay}-${lectureTime}`] || [];
                    bookedRooms[`${lectureDay}-${lectureTime}`].push(lab.name);
                    roundedAttendance = 0;
                    break;
                } else {
                    assignments.push({
                        day: lectureDay,
                        time: lectureTime,
                        lecture: lecture.lecture,
                        professor: lecture.professor,
                        groups: lecture.groups,
                        hall: lab.name,
                        center,
                    });
                    bookedRooms[`${lectureDay}-${lectureTime}`] = bookedRooms[`${lectureDay}-${lectureTime}`] || [];
                    bookedRooms[`${lectureDay}-${lectureTime}`].push(lab.name);
                    roundedAttendance -= lab.capacity;
                }
            }
        }

        // if (roundedAttendance > 0) {
        //     console.log(`Warning: No room available for ${roundedAttendance} students in lecture ${lecture.lecture} on ${lectureDay} at ${lectureTime}`);
        // }
    }

    return assignments ;
};

// Function to fetch registered students
export const fetchRegisteredStudents = async () => {
    const courses = await Course.find({}).populate('centers'); // Populate centers to get their details
    const centers = await Center.find({}); // Fetch all centers to get their groups

    const centerMap = centers.reduce((map, center) => {
        map[center.centerName] = center.groups; // Create a map of center names to their groups
        return map;
    }, {});

    const registeredStudents = courses.flatMap(course => 
        course.centers.map(center => ({
            center: center.centerName,
            group: centerMap[center.centerName] || null, // Get the group from the map
            course: course.courseName,
            studentCount: center.numberOfStudents
        }))
    );

    return registeredStudents.sort((a, b) => b.studentCount - a.studentCount);
};

// Function to fetch lecture halls
export const fetchLectureHalls = async () => {
    return await Room.find({ type: 'LECTURE_HALL' }).select('center name capacity');
};

// Function to fetch labs
export const fetchLabs = async () => {
    return await Room.find({ type: 'LAB' }).select('center name capacity');
};

// Function to fetch schedules
export const fetchSchedules = async () => {
    return await Schedule.find({}); // Adjust the populate if you have a reference to a User model for professors
};

export async function POST(request) {
    try {
        await connectDB();
        
        const schedule = await fetchSchedules();
        const registeredStudents = await fetchRegisteredStudents();
        const lectureHalls = await fetchLectureHalls();
        const labs = await fetchLabs();

        const assignments = await distributeLectures(schedule, registeredStudents, lectureHalls, labs);
        
        await Distributed_lectures.deleteMany({});
        // Save assignments to the database
        await Distributed_lectures.insertMany(assignments.map(assignment => ({
            day: assignment.day,
            time: assignment.time,
            lecture: assignment.lecture,
            professor: assignment.professor,
            groups: assignment.groups,
            hall: assignment.hall,
            center: assignment.center,
        })));

        return NextResponse.json({
            message: 'Lectures distributed and saved successfully',
            count: assignments.length,
            assignments
        }, { status: 200 });
    } catch (error) {
        console.error('Error distributing lectures:', error);
        return NextResponse.json({
            message: 'Error distributing lectures',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// Add a GET handler
export async function GET(request) {
    try {
        await connectDB();
        const distributedLectures = await Distributed_lectures.find({}); ;
        return NextResponse.json({
            message: 'Distributed lectures fetched successfully',
            count : distributedLectures.length ,
            data: distributedLectures,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching distributed lectures:', error);
        return NextResponse.json({
            message: 'Error fetching distributed lectures',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
