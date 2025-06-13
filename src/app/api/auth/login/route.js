import { NextResponse } from 'next/server';

import connectDB from '../../lib/db';
import User from '../../lib/models/User';
import { generateToken } from '../../lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'username and password are required' },
        { status: 400 }
      );
    }

    let userType;
    if (username.length === 7) {
      userType = '2'; // regular student
    } else {
      userType = '1'; // admin credential type for remote API
    }

    // Form data for university login (same for everyone)
    const form = new URLSearchParams({
      UserName: username,
      Password: password,
      sysID: '313',
      UserLang: 'E',
      userType: userType,
    });

    // Attempt remote authentication
    let remoteOk = false;
    try {
      const uniRes = await fetch('https://sis.eelu.edu.eg/studentLogin', {
        method: 'POST',
        body: form,
      });
      const uniData = await uniRes.json();
      remoteOk = uniData?.rows?.[0]?.row?.LoginOK === 'True';
    } catch (err) {
      console.error('University login error: ', err);
      return NextResponse.json(
        { message: 'Unable to reach university login service' },
        { status: 502 }
      );
    }

    if (!remoteOk) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Decide role based on local DB record
    await connectDB();
    let user = await User.findOne({ username });

    let role;
    if (!user) {
      role = 'user';
    } else {
      role = user.role;
    }
    

    // Issue JWT
    const token = generateToken(role, username);

    const response = NextResponse.json(
      { message: 'Login successful', role, token },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 3,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        message: 'Server error during login',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
