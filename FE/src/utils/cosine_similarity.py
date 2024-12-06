from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Dữ liệu công việc
jobs = [
    {"id": 1, "positionWork": "Software Engineer", "skill": "Java, Spring, MySQL"},
    {"id": 2, "positionWork": "Data Scientist", "skill": "Python, Machine Learning, SQL"},
    {"id": 3, "positionWork": "Web Developer", "skill": "HTML, CSS, JavaScript"}
]

# Dữ liệu người dùng
user = {"positionWork": "Software Engineer", "skill": "Java, MySQL"}

# 1. Gộp dữ liệu thành chuỗi mô tả
def combine_features(data):
    return f"{data['positionWork']} {data['skill']}"

job_descriptions = [combine_features(job) for job in jobs]
user_description = combine_features(user)

# 2. Vector hóa dữ liệu với TF-IDF
vectorizer = TfidfVectorizer()
job_vectors = vectorizer.fit_transform(job_descriptions)  # Vector hóa công việc
user_vector = vectorizer.transform([user_description])   # Vector hóa người dùng

# 3. Tính toán Cosine Similarity
similarities = cosine_similarity(user_vector, job_vectors).flatten()

# 4. Gợi ý công việc (Sắp xếp theo độ tương đồng)
sorted_indices = similarities.argsort()[::-1]
recommended_jobs = [{"job": jobs[i], "similarity": similarities[i]} for i in sorted_indices]

# 5. Hiển thị kết quả gợi ý
print("Danh sách gợi ý công việc theo mức độ phù hợp:")
for idx, rec in enumerate(recommended_jobs, start=1):
    job = rec["job"]
    print(f"{idx}. {job['id']} {job['positionWork']} (Similarity: {rec['similarity']:.2f})")
