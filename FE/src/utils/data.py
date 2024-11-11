import psycopg2
import json

# Kết nối với cơ sở dữ liệu PostgreSQL
def connect_db():
    return psycopg2.connect(
        dbname="findjob",
        user="postgres",
        password="123",
        host="localhost",
        port="5432"
    )

# Hàm để đọc dữ liệu từ file JSON
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Hàm để chèn dữ liệu vào bảng
def insert_data(data):
    try:
        # Kết nối cơ sở dữ liệu
        connection = connect_db()
        cursor = connection.cursor()

        # Câu lệnh SQL để chèn dữ liệu vào bảng districts
        insert_query = """
        INSERT INTO district (id, name, city_id)
        VALUES (%s, %s, %s)
        """

        # Duyệt qua danh sách dữ liệu và thực hiện chèn
        for item in data:
            cursor.execute(insert_query, (item['id'], item['name'], item['city_id']))

        # Commit thay đổi
        connection.commit()

        print(f"{len(data)} rows inserted successfully.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        # Đảm bảo đóng kết nối sau khi hoàn tất
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Đọc dữ liệu từ file JSON
file_path = 'src/utils/districts.json'  # Thay thế đường dẫn đến file JSON của bạn
data_from_file = read_json_file(file_path)

# Chèn dữ liệu từ file JSON vào cơ sở dữ liệu
insert_data(data_from_file)
    