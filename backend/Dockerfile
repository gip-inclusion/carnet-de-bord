FROM python:3.10-alpine3.15

WORKDIR /code

# Install dependencies:
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy api, script code
COPY ./api /code
COPY ./scripts /code

# Run the application:
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "4000"]
