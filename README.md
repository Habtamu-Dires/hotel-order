## Hotel/Restaurant Order Management System

#### Project Overview

This is a comprehensive web application designed to streamline the order management process in hotels and restaurants. It enables customers to interact with the system through QR codes, making ordering, billing, and requesting service seamless. The application also provides real-time updates to waiters, kitchen staff, and administrators, ensuring smooth communication and efficient workflow.

### Technologies Used

**Frontend**: Angular with Tailwind CSS for responsive and modern UI.

Backend: Spring Boot with Hibernate for robust API development.

**Database**: PostgreSQL for reliable data storage.

**Authentication**: JWT (JSON Web Token) for secure user authentication.

**Deployment**: Docker for containerization and NGINX for reverse proxy and load balancing.

**Real-Time Communication**: WebSockets for instant notifications between customers, waiters, and kitchen staff.

**Batch Processing**: Spring Batch for nightly data aggregation and analytics.

### System Highlights

**Scalable Architecture**:

Load balancing using NGINX to distribute traffic across multiple backend instances.

Dockerized setup for easy deployment and management.

**Interactive Visualizations**:

Dynamic graphs and charts in the admin dashboard for actionable insights.

**Real-Time Updates**:

WebSocket integration ensures immediate communication between system components.


![](/diagram/deployment-diagram.png)