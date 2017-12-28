echo "Waiting for local test server to become available..."
curl http://localhost:3000 > /dev/null 2>&1
while [ $? -ne 0 ]; do
    sleep 3
    curl [http://localhost:3000 > /dev/null 2>&1
done

echo "Waiting 10 seconds..."
sleep 10

echo "Running tests..."
npm e2e
