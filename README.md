# Scalable Image Editor Website
A highly scalable image editor web application hosted in AWS using serverless architecture and Docker-compose for containerization.
## User features include:
  - Rotate
  - Flip
  - Sharpen
  - Blur
  - Image hosting

## Frontend
- React
- Javascript

## Backend
- Express.Js
- Javascript
- Docker-compose
- Hosted in AWS
    - Redis + S3 bucket - to store images
    - Load Balancer - to balance load between multiple instances
    - Auto-scaling group - to start up new instances when traffic becomes busy
