import { pgTable, text, integer, timestamp, boolean, uuid, varchar } from "drizzle-orm/pg-core";
			
export const users = pgTable("users", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
email: text('email').notNull().unique(),
emailVerified: boolean('email_verified').notNull(),
image: text('image'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
});

	export const sessions = pgTable("sessions", {
		id: text("id").primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
token: text('token').notNull().unique(),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull(),
ipAddress: text('ip_address'),
userAgent: text('user_agent'),
userId: text('user_id').notNull().references(()=> users.id, { onDelete: 'cascade' })
	});

export const accounts = pgTable("accounts", {
		id: text("id").primaryKey(),
		accountId: text('account_id').notNull(),
providerId: text('provider_id').notNull(),
userId: text('user_id').notNull().references(()=> users.id, { onDelete: 'cascade' }),
accessToken: text('access_token'),
refreshToken: text('refresh_token'),
idToken: text('id_token'),
accessTokenExpiresAt: timestamp('access_token_expires_at'),
refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
scope: text('scope'),
password: text('password'),
createdAt: timestamp('created_at').notNull(),
updatedAt: timestamp('updated_at').notNull()
	});

export const verifications = pgTable("verifications", {
		id: text("id").primaryKey(),
		identifier: text('identifier').notNull(),
value: text('value').notNull(),
expiresAt: timestamp('expires_at').notNull(),
createdAt: timestamp('created_at'),
updatedAt: timestamp('updated_at')
	});

	// Table: workouts
export const workouts = pgTable("workouts", {
	id: text("id").primaryKey(),
	name: text("name").notNull(), // e.g., Arms, Legs
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
  });
  
  // Table: user_workouts
  export const userWorkouts = pgTable("user_workouts", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	workoutId: text("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
	customName: text("custom_name"), // Optional override like "Push Day 1"
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
  });
  
  // Table: exercises
  export const exercises = pgTable("exercises", {
	id: text("id").primaryKey(),
	userWorkoutId: text("user_workout_id").notNull().references(() => userWorkouts.id, { onDelete: "cascade" }),
	name: text("name").notNull(), // e.g., Bicep Curl
	weight: integer("weight").notNull(),
	reps: integer("reps").notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull()
  });
  
  // Table: exercise_order
  export const exerciseOrder = pgTable("exercise_order", {
	id: text("id").primaryKey(),
	exerciseId: text("exercise_id").notNull().references(() => exercises.id, { onDelete: "cascade" }),
	order: integer("order").notNull()
  });
  
  // Table: exercise_logs
  export const exerciseLogs = pgTable("exercise_logs", {
	id: text("id").primaryKey(),
	exerciseId: text("exercise_id").notNull().references(() => exercises.id, { onDelete: "cascade" }),
	weight: integer("weight").notNull(),
	reps: integer("reps").notNull(),
	loggedAt: timestamp("logged_at").notNull()
  });
  