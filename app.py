from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os
import uuid
import math
from werkzeug.utils import secure_filename
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from datetime import timedelta

# ================= APP =================
app = Flask(__name__, static_folder="static")

# ================= CORS (FIXED) =================
CORS(
    app,
    
    resources={r"/api/*": {
        "origins": "*"
    }},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# ================= JWT =================
app.config["JWT_SECRET_KEY"] = "jwt_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

jwt = JWTManager(app)

# ================= UPLOAD =================
UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ================= DB =================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="velmurugan2002",
        database="ecommerce_db"
    )
def allowed_file(filename):
    return (
        "." in filename and
        filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )

# ================= HOME =================

@app.route("/")
def home():
    return jsonify({"message": "E-Commerce Backend Running"})

# ================= REGISTER =================

@app.route("/api/register", methods=["POST"])
def register():
    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        if cursor.fetchone():
            return jsonify({
                "message": "Email already exists"
            }), 400
        hashed = generate_password_hash(password)

        cursor = db.cursor()

        cursor.execute("""
            INSERT INTO users
            (name,email,password,role)
            VALUES (%s,%s,%s,%s)
        """, (
            name,
            email,
            hashed,
            "customer"
        ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Registered Successfully"
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# ================= LOGIN =================
@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json

        email = data.get("email")
        password = data.get("password")

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        db.close()


        if not user:
            return jsonify({
                "message": "User not found"
            }), 401


        if not check_password_hash(
            user["password"],
            password
        ):
            return jsonify({
                "message": "Invalid password"
            }), 401



        access_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={
                "role": user["role"],
                "name": user["name"]
            }
        )


        refresh_token = create_refresh_token(
            identity=str(user["id"])
        )


        return jsonify({

            "message": "Login Success",

            "access_token": access_token,

            "refresh_token": refresh_token,

            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "avatar_url": user.get("avatar_url")
            }

        }), 200



    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    
    # ================= REFRESH TOKEN =================

@app.route("/api/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    try:
        user_id = get_jwt_identity()

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE id=%s",
            (user_id,)
        )

        user = cursor.fetchone()

        cursor.close()
        db.close()

        if not user:
            return jsonify({
                "message": "User not found"
            }), 404

        new_access_token = create_access_token(
            identity=str(user["id"]),
            additional_claims={
                "role": user["role"],
                "name": user["name"]
            }
        )

        return jsonify({
            "access_token": new_access_token
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# =========================
# CURRENT USER
# =========================

@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    try:
        user_id = int(get_jwt_identity())

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                role,
                avatar_url,
                created_at
            FROM users
            WHERE id=%s
        """, (user_id,))

        user = cursor.fetchone()

        cursor.close()
        db.close()

        if not user:
            return jsonify({
                "error": "User not found"
            }), 404

        return jsonify(user), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500



@app.route("/api/me", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())

        data = request.get_json()

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        avatar_url = data.get("avatar_url")


        if not name or not email:
            return jsonify({
                "error": "Name and email required"
            }), 400


        db = get_db_connection()
        cursor = db.cursor()


        try:
            cursor.execute("""
                UPDATE users
                SET 
                    name=%s,
                    email=%s,
                    avatar_url=%s
                WHERE id=%s
            """, (
                name,
                email,
                avatar_url,
                user_id
            ))


            db.commit()


            return jsonify({
                "message": "Profile updated successfully"
            }), 200


        except mysql.connector.IntegrityError:
            return jsonify({
                "error": "Email already in use"
            }), 409


        finally:
            cursor.close()
            db.close()


    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500





@app.route("/api/me/password", methods=["PUT"])
@jwt_required()
def change_password():
    try:
        user_id = int(get_jwt_identity())

        data = request.get_json()


        current = data.get(
            "current_password",
            ""
        ).strip()

        new_pass = data.get(
            "new_password",
            ""
        ).strip()

        confirm = data.get(
            "confirm_password",
            ""
        ).strip()



        if not current or not new_pass or not confirm:
            return jsonify({
                "error": "All fields are required"
            }), 400



        if new_pass != confirm:
            return jsonify({
                "error": "Passwords do not match"
            }), 400



        if len(new_pass) < 6:
            return jsonify({
                "error": "Minimum 6 characters"
            }), 400



        db = get_db_connection()
        cursor = db.cursor(dictionary=True)



        cursor.execute(
            """
            SELECT password 
            FROM users 
            WHERE id=%s
            """,
            (user_id,)
        )


        user = cursor.fetchone()



        if not user:
            cursor.close()
            db.close()

            return jsonify({
                "error": "User not found"
            }), 404




        if not check_password_hash(
            user["password"],
            current
        ):

            cursor.close()
            db.close()

            return jsonify({
                "error": "Current password incorrect"
            }), 401




        hashed_password = generate_password_hash(
            new_pass
        )



        cursor.execute(
            """
            UPDATE users
            SET password=%s
            WHERE id=%s
            """,
            (
                hashed_password,
                user_id
            )
        )


        db.commit()


        cursor.close()
        db.close()



        return jsonify({
            "message": "Password changed successfully"
        }), 200



    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
# ================= CATEGORIES =================

@app.route("/api/categories")
def get_categories():
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM categories"
        )

        data = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(data)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# ================= PRODUCTS =================
import math

@app.route("/api/products")
def get_products():
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 8))
        search = request.args.get("search", "")

        offset = (page - 1) * limit

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Count total matching products
        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM products p
            WHERE p.name LIKE %s
        """, (f"%{search}%",))

        total = cursor.fetchone()["total"]

        # Fetch paginated products
        cursor.execute("""
            SELECT
                p.*,
                c.name AS category
            FROM products p
            LEFT JOIN categories c
            ON p.category_id = c.id
            WHERE p.name LIKE %s
            ORDER BY p.id DESC
            LIMIT %s OFFSET %s
        """, (f"%{search}%", limit, offset))

        products = cursor.fetchall()

        cursor.close()
        db.close()

        # Calculate total pages
        total_pages = math.ceil(total / limit) if total > 0 else 1

        return jsonify({
            "products": products,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    

# ================= PRODUCT DETAIL =================

@app.route("/api/products/<int:id>")
def get_product(id):
    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT p.*, c.name AS category
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id=%s
        """, (id,))

        product = cursor.fetchone()

        cursor.close()
        db.close()

        if not product:
            return jsonify({"message": "Product Not Found"}), 404

        return jsonify(product)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ================= PLACE ORDER =================
@app.route("/api/orders", methods=["POST"])
@jwt_required()
def create_order():
    try:
        data = request.json

        # Get logged-in user ID from JWT
        user_id = get_jwt_identity()

        items = data.get("items", [])
        address = data.get("address")

        if not address:
            return jsonify({"message": "Address required"}), 400

        if not items:
            return jsonify({"message": "Cart empty"}), 400

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        total = 0

        for item in items:

            product_id = item.get("product_id")
            quantity = item.get("quantity")

            cursor.execute(
                "SELECT * FROM products WHERE id=%s",
                (product_id,)
            )

            product = cursor.fetchone()

            if not product:
                return jsonify({
                    "message": "Product not found"
                }), 404

            if product["stock"] < quantity:
                return jsonify({
                    "message": f"{product['name']} out of stock"
                }), 400

            total += float(product["price"]) * quantity

        cursor = db.cursor()

        cursor.execute("""
            INSERT INTO orders
            (user_id,total_amount,address,status)
            VALUES (%s,%s,%s,%s)
        """, (
            user_id,
            total,
            address,
            "Pending"
        ))

        order_id = cursor.lastrowid

        for item in items:

            product_id = item.get("product_id")
            quantity = item.get("quantity")

            cursor.execute(
                "SELECT price FROM products WHERE id=%s",
                (product_id,)
            )

            price = cursor.fetchone()[0]

            cursor.execute("""
                INSERT INTO order_items
                (order_id,product_id,quantity,unit_price)
                VALUES (%s,%s,%s,%s)
            """, (
                order_id,
                product_id,
                quantity,
                price
            ))

            cursor.execute("""
                UPDATE products
                SET stock = stock - %s
                WHERE id=%s
            """, (
                quantity,
                product_id
            ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Order placed successfully",
            "order_id": order_id
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ================= MY ORDERS =================
@app.route("/api/orders/my")
@jwt_required()
def my_orders():
    try:
        user_id = get_jwt_identity()

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM orders
            WHERE user_id=%s
            ORDER BY id DESC
        """, (user_id,))

        orders = cursor.fetchall()

        for order in orders:
            cursor.execute("""
                SELECT
                    oi.*,
                    p.name
                FROM order_items oi
                JOIN products p
                ON p.id = oi.product_id
                WHERE oi.order_id=%s
            """, (order["id"],))

            order["items"] = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(orders)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ================= ADMIN ORDERS =================
@app.route("/api/admin/orders")
@jwt_required()
def get_all_orders():
    try:
        # Check if logged-in user is admin
        claims = get_jwt()

        if claims.get("role") != "admin":
            return jsonify({
                "message": "Admin access required"
            }), 403

        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))

        offset = (page - 1) * limit

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Count total orders
        cursor.execute("""
            SELECT COUNT(*) AS total
            FROM orders
        """)

        total = cursor.fetchone()["total"]

        # Fetch paginated orders
        cursor.execute("""
            SELECT
                o.id,
                IFNULL(u.name, 'Unknown') AS customer_name,
                o.total_amount,
                o.status,
                o.address,
                o.ordered_at
            FROM orders o
            LEFT JOIN users u
            ON o.user_id = u.id
            ORDER BY o.id DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))

        orders = cursor.fetchall()

        cursor.close()
        db.close()

        total_pages = math.ceil(total / limit) if total > 0 else 1

        return jsonify({
            "orders": orders,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": total_pages
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ================= UPDATE ORDER STATUS =================

@app.route("/api/admin/orders/<int:id>", methods=["PUT"])
@jwt_required()
def update_order_status(id):
    try:
        # Check admin role
        claims = get_jwt()

        if claims.get("role") != "admin":
            return jsonify({
                "message": "Admin access required"
            }), 403

        data = request.json

        status = data.get("status")

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("""
            UPDATE orders
            SET status=%s
            WHERE id=%s
        """, (
            status,
            id
        ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Status Updated"
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    

# ================= UPLOAD IMAGE =================
@app.route("/api/upload", methods=["POST"])
def upload_image():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        ext = file.filename.rsplit(".", 1)[1].lower()
        unique_name = f"{uuid.uuid4().hex}.{ext}"

        filepath = os.path.join(app.config["UPLOAD_FOLDER"], unique_name)
        file.save(filepath)

        # ✅ FIXED FULL URL (IMPORTANT)
        image_url = request.host_url + "static/uploads/" + unique_name

        return jsonify({"image_url": image_url}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ================= SERVE IMAGE =================
@app.route("/static/uploads/<path:filename>")
def serve_uploaded_file(filename):
    return send_from_directory(
        os.path.join(app.root_path, "static/uploads"),
        filename
    )

# ================= ADMIN ADD PRODUCT =================

@app.route("/api/admin/products", methods=["POST"])
@jwt_required()
def add_product():
    try:
        # Check admin role
        claims = get_jwt()

        if claims.get("role") != "admin":
            return jsonify({
                "message": "Admin access required"
            }), 403

        data = request.json

        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        image_url = data.get("image_url")
        stock = data.get("stock")
        category_id = data.get("category_id")

        # FIX IMAGE URL
        if image_url and image_url.startswith("/static"):
            image_url = request.host_url + image_url.lstrip("/")

        if not all([name, price, stock, category_id]):
            return jsonify({
                "message": "Missing fields"
            }), 400

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            "SELECT id FROM categories WHERE id=%s",
            (category_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "message": "Invalid category_id"
            }), 400

        cursor.execute("""
            INSERT INTO products
            (name, description, price, image_url, stock, category_id)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (
            name,
            description,
            price,
            image_url,
            stock,
            category_id
        ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Product Added Successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ================= ADMIN UPDATE PRODUCT =================
@app.route("/api/admin/products/<int:id>", methods=["PUT"])
@jwt_required()
def update_product(id):
    try:
        # Check admin role
        claims = get_jwt()

        if claims.get("role") != "admin":
            return jsonify({
                "message": "Admin access required"
            }), 403

        data = request.json

        name = data.get("name")
        description = data.get("description")
        price = data.get("price")
        image_url = data.get("image_url")
        stock = data.get("stock")
        category_id = data.get("category_id")

        if not all([name, price, stock, category_id]):
            return jsonify({
                "message": "Missing fields"
            }), 400

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("""
            UPDATE products
            SET name=%s,
                description=%s,
                price=%s,
                image_url=%s,
                stock=%s,
                category_id=%s
            WHERE id=%s
        """, (
            name,
            description,
            price,
            image_url,
            stock,
            category_id,
            id
        ))

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Product Updated Successfully"
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# ================= ADMIN DELETE PRODUCT =================

@app.route("/api/admin/products/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_product(id):
    try:
        # Check admin role
        claims = get_jwt()

        if claims.get("role") != "admin":
            return jsonify({
                "message": "Admin access required"
            }), 403

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            "DELETE FROM products WHERE id=%s",
            (id,)
        )

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Product Deleted"
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    
    # ================= RUN APP =================

if __name__ == "__main__":
    app.run(debug=True)