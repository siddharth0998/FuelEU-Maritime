Prompt: "Provide the Prisma schema matching the Fuel EU assignment database requirements."

Observations: The AI correctly used the @@map directive to satisfy the exact database column naming requirements (snake_case) from the prompt, while preserving standard TypeScript conventions in the generated client.

Prompt: "Write the Prisma seed script to insert the 5 mock routes from the assignment brief, setting one as the baseline."

Observations: The AI provided a script using prisma.route.upsert to prevent duplicate data issues if the seed is run multiple times, and successfully populated the local PostgreSQL database.