import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import User from "../../lib/models/User";
import { verifyAuth } from "../../lib/auth";

// Helper to ensure requester is admin
async function requireAdmin() {
  const decoded = await verifyAuth();
  if (!decoded || decoded.role !== "admin") {
    return null;
  }
  return decoded;
}

// POST /api/admin/users  => create new user
export async function POST(request) {
  // // Verify admin
  // const admin = await requireAdmin();
  // if (!admin) {
  //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  // }

  const { username, role = "admin", name } = await request.json();

  if (!username) {
    return NextResponse.json(
      { message: "username is required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const newUser = await User.create({ username, role, name });
    return NextResponse.json(
      {
        message: "User created",
        user: { username: newUser.username, role: newUser.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin create user error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT /api/admin/users  => update user by username (can change username)
export async function PUT(request) {
  // // Verify admin
  // const admin = await requireAdmin();
  // if (!admin) {
  //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  // }

  const { originalUsername, username, name, role } = await request.json();

  if (!originalUsername) {
    return NextResponse.json(
      { message: "originalUsername is required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ username: originalUsername });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    // If username is changed, check for duplicates
    if (username && username !== originalUsername) {
      const existing = await User.findOne({ username });
      if (existing) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 409 }
        );
      }
      user.username = username;
    }
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    await user.save();
    return NextResponse.json(
      { message: "User updated", user: { username: user.username, name: user.name, role: user.role } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// DELETE /api/admin/users  => delete user by username (body or query param)
export async function DELETE(request) {
  // const admin = await requireAdmin();
  // if (!admin) {
  //   return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  // }

  let username;
  if (request.method === "DELETE") {
    // In edge runtime, request.json() not allowed for DELETE? It's allowed. We'll parse.
    try {
      const body = await request.json();
      username = body.username;
    } catch {
      // no body maybe query param
      const { searchParams } = new URL(request.url);
      username = searchParams.get("username");
    }
  }

  if (!username) {
    return NextResponse.json(
      { message: "username is required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const deleted = await User.findOneAndDelete({ username });
    if (!deleted) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET /api/admin/users  => list users (optional ?role=admin | user)
export async function GET(request) {
  // const admin = await requireAdmin();
  // if (!admin) {
  //   return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  // }

  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get("role");

  try {
    await connectDB();
    const query = roleFilter ? { role: roleFilter } : {};
    const users = await User.find(query).select("username role name -_id");
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Admin list users error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
