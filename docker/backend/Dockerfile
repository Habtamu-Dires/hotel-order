#Build Stage
FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

#Runtime Stage
FROM amazoncorretto:21
ARG PROFILE=dev
ARG APP_VERSION=1.1.3

WORKDIR /app
COPY --from=build /build/target/HotelOrderMng-*.jar /app/

EXPOSE 8088

ENV DB_URL=jdbc:postgresql://postgres-hotel-order:5432/hotel_order_db
ENV JAR_VERSION=${APP_VERSION}
ENV ACTIVE_PROFILE=${PROFILE}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} HotelOrderMng-${JAR_VERSION}.jar


