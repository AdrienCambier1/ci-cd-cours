import mysql.connector
import os
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        port=int(os.getenv("MYSQL_PORT")),
        host=os.getenv("MYSQL_HOST"),
    )

@app.get("/users")
async def get_users():
    with get_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM users")
            records = cursor.fetchall()

    return {"users": records}

@app.post("/users")
async def create_user(user: dict):
    with get_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                INSERT INTO users (
                    last_name,
                    first_name,
                    email,
                    birthdate,
                    city,
                    postal_code
                )
                SELECT
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM users
                    WHERE email = %s
                )
                """,
                (
                    user["lastName"],
                    user["firstName"],
                    user["email"],
                    user["birthDate"],
                    user["city"],
                    user["postalCode"],
                    user["email"],
                ),
            )
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE email = %s", (user["email"],))
            created_user = cursor.fetchone()

    return {"user": created_user}

@app.patch("/users/{user_id}")
async def update_user(user_id: int, user: dict):
    with get_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                UPDATE users
                SET
                    last_name = %s,
                    first_name = %s,
                    email = %s,
                    birthdate = %s,
                    city = %s,
                    postal_code = %s
                WHERE id = %s
                """,
                (
                    user["lastName"],
                    user["firstName"],
                    user["email"],
                    user["birthDate"],
                    user["city"],
                    user["postalCode"],
                    user_id,
                ),
            )
            conn.commit()
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            updated_user = cursor.fetchone()

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user": updated_user}

@app.delete("/users/{user_id}")
async def delete_user(user_id: int):
    with get_connection() as conn:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            conn.commit()
            if cursor.rowcount == 0:
                raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}
