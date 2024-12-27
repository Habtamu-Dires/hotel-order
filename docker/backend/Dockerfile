#Build Stage
FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#Runtime Stage
FROM openjdk:21-slim
ARG PROFILE=dev
ARG APP_VERSION=1.1.4

WORKDIR /app

# Timezone setup - Add these lines
RUN apt-get update && apt-get install -y tzdata
ENV TZ="Africa/Addis_Ababa"

COPY --from=build /build/target/hotel-order-api-*.jar /app/

EXPOSE 8088

ENV DB_URL=jdbc:postgresql://postgres-hotel-order:5432/hotel_order_db
ENV JAR_VERSION=${APP_VERSION}
ENV ACTIVE_PROFILE=${PROFILE}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} hotel-order-api-${JAR_VERSION}.jar


