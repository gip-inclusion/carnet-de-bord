FROM python:3.10-alpine3.15

WORKDIR /code

# Install dependencies:
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Run the application:
COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
