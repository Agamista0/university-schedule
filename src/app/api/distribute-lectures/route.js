import { NextResponse } from "next/server";
import connectDB from '../lib/db';
import Schedule from '../lib/models/Schedule';
import Room from '../lib/models/Room';
import Course from '../lib/models/Course';
import { ratio } from "fuzzball";
import fs from 'fs';
import path from 'path';
import Center from '../lib/models/Center';
import Distributed_lectures from '../lib/models/Distributed_lectures';


export const runtime = 'nodejs';


const isRoomAvailable = (bookedRooms, day, time, roomName) => {
  return (
    !bookedRooms.hasOwnProperty(`${day},${time}`) ||
    !bookedRooms[`${day},${time}`].includes(roomName)
  );
};

const areSimilarNames = (name1, name2, threshold = 90) => {
  return ratio(name1.toLowerCase(), name2.toLowerCase()) >= threshold;
};

const distributeLectures = async (
  schedule,
  registeredStudents,
  lectureHalls,
  labs,
  bufferPercentage = 0.15
) => {
  const assignments = [];
  const bookedRooms = {};

  // Sort rooms by capacity
  lectureHalls.sort((a, b) => b[2] - a[2]);
  labs.sort((a, b) => b[2] - a[2]);
  const lecturesWithAttendance = [];
  for (const lecture of schedule) {
    const courseId = lecture.lecture;
    const lectureDay = lecture.day;
    const lectureTime = lecture.time;
    const lectureGroups = lecture.groups;

    for (const student of registeredStudents) {
      const { center, group, course, studentCount } = student;

      const groupsArray = String(group)
        .split(",")
        .map((g) => g.trim());
      const groupExists = groupsArray.some((g) => lectureGroups.has(g));

      if (areSimilarNames(course, courseId) && groupExists) {
        let expectedAttendance;
        if (Object.values(lectureGroups).every((g) => g === "FTF")) {
          expectedAttendance = studentCount;
        } else if (Object.values(lectureGroups).every((g) => g === "VSR")) {
          console.log(`Skipping lecture ${courseId} as all groups are VSR`);
          continue;
        } else {
          expectedAttendance = studentCount / 2;
        }

        lecturesWithAttendance.push({
          lecture,
          expectedAttendance,
          center,
        });
      }
    }
  }

  lecturesWithAttendance.sort(
    (a, b) => b.expectedAttendance - a.expectedAttendance
  );

  for (const lectureData of lecturesWithAttendance) {
    const { lecture, expectedAttendance, center } = lectureData;
    const lectureDay = lecture.day;
    const lectureTime = lecture.time;
    const buffer = expectedAttendance * bufferPercentage;

    const availableRooms = lectureHalls.filter(
      (hall) =>
        areSimilarNames(hall.center, center) &&
        isRoomAvailable(bookedRooms, lectureDay, lectureTime, hall.name)
    );
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
          capacityHall: hall.capacity,
        });
        bookedRooms[`${lectureDay}-${lectureTime}`] =
          bookedRooms[`${lectureDay}-${lectureTime}`] || [];
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
          capacityHall: hall.capacity,
        });
        bookedRooms[`${lectureDay}-${lectureTime}`] =
          bookedRooms[`${lectureDay}-${lectureTime}`] || [];
        bookedRooms[`${lectureDay}-${lectureTime}`].push(hall.name);
        roundedAttendance -= hall.capacity;
      }
    }

    if (roundedAttendance > 0) {
      const availableLabs = labs.filter(
        (lab) =>
          areSimilarNames(lab.center, center) &&
          isRoomAvailable(bookedRooms, lectureDay, lectureTime, lab.name)
      );
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
            capacityHall: lab.capacity,
          });
          bookedRooms[`${lectureDay}-${lectureTime}`] =
            bookedRooms[`${lectureDay}-${lectureTime}`] || [];
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
            capacityHall: lab.capacity,
          });
          bookedRooms[`${lectureDay}-${lectureTime}`] =
            bookedRooms[`${lectureDay}-${lectureTime}`] || [];
          bookedRooms[`${lectureDay}-${lectureTime}`].push(lab.name);
          roundedAttendance -= lab.capacity;
        }
      }
    }

    if (roundedAttendance > 0) {
      console.log(
        `Warning: No room available for ${roundedAttendance} students in lecture ${lecture.lecture} on ${lectureDay} at ${lectureTime}`
      );
    }
  }

  return assignments;
};

// Function to fetch registered students
export const fetchRegisteredStudents = async () => {
  const courses = await Course.find({}).populate("centers"); // Populate centers to get their details
  const centers = await Center.find({}); // Fetch all centers to get their groups

  const centerMap = centers.reduce((map, center) => {
    map[center.centerName] = center.groups; // Create a map of center names to their groups
    return map;
  }, {});

  const registeredStudents = courses.flatMap((course) =>
    course.centers.map((center) => ({
      center: center.centerName,
      group: centerMap[center.centerName] || null, // Get the group from the map
      course: course.courseName,
      studentCount: center.numberOfStudents,
    }))
  );

  return registeredStudents.sort((a, b) => b.studentCount - a.studentCount);
};

// Function to fetch lecture halls
export const fetchLectureHalls = async () => {
  return await Room.find({ type: "LECTURE_HALL" }).select(
    "center name capacity"
  );
};

// Function to fetch labs
export const fetchLabs = async () => {
  return await Room.find({ type: "LAB" }).select("center name capacity");
};

// Function to fetch schedules
export const fetchSchedules = async () => {
  return await Schedule.find({}); // Adjust the populate if you have a reference to a User model for professors
};



export async function POST(request) {
    try {
        await connectDB();
        
        // Check if there are any distributed lectures
        // const distributedLectures = await Distributed_lectures.find({});
        // if (!distributedLectures || distributedLectures.length === 0) {
        //     return NextResponse.json({
        //         message: 'No distributed lectures found. Please distribute lectures first.',
        //         error: 'No distributed lectures available'
        //     }, { status: 400 });
        // }

        const filePath = path.join(process.cwd(), 'src/app/public/formats/test2.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const sections = JSON.parse(fileContent);

        // Clear existing data and insert new sections
        await Distributed_lectures.deleteMany({});
        const insertedSections = await Distributed_lectures.insertMany(sections);

        return NextResponse.json({
            message: 'Sections distributed successfully',
            count: insertedSections.length
        }, { status: 200 });

    } catch (error) {
        console.error('Error distributing sections:', error);
        return NextResponse.json({
            message: 'Error distributing sections',
            error: error.message
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();
         // Parse query parameters
         const { searchParams } = new URL(request.url);
         const section = searchParams.get('section');
         const center = searchParams.get('center');
         const department = searchParams.get('department');
 
         // Build filter object
         const filter = {};
         if (section) filter.section = { $regex: section, $options: 'i' };
         if (center) filter.center = center;
         if (department) filter.department = department;
 
        const cursor = Distributed_lectures.find(filter).lean().cursor(); // Use cursor for streaming
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                controller.enqueue(encoder.encode('['));
                let first = true;

                for await (const doc of cursor) {
                    const json = JSON.stringify(doc);
                    if (!first) controller.enqueue(encoder.encode(','));
                    controller.enqueue(encoder.encode(json));
                    first = false;
                }

                controller.enqueue(encoder.encode(']'));
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({
            message: 'Error fetching sections',
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await connectDB();
        
        const result = await Distributed_lectures.deleteMany({});
        
        return NextResponse.json({
            message: 'All lectures deleted successfully',
            deletedCount: result.deletedCount
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting lectures:', error);
        return NextResponse.json({
            message: 'Error deleting lectures',
            error: error.message
        }, { status: 500 });
    }
}
