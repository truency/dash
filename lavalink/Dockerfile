FROM openjdk:10-slim
LABEL maintainer "Nomsy <me@nomsy.net>"
RUN apt-get update && apt-get install -y curl
RUN curl -o Lavalink.jar https://ci.fredboat.com/repository/download/Lavalink_Build/3697:id/Lavalink.jar?guest=1
ENV SERVER_PORT=8086 \
    SERVER_ADDRESS=0.0.0.0 \
    LAVALINK_SERVER_PASSWORD=thisistheendtimes \
    LAVALINK_SERVER_WS_PORT=8087 \
    LAVALINK_SERVER_WS_HOST=0.0.0.0 \
    LAVALINK_SERVER_SOURCES_HTTP=false \
    LAVALINK_SERVER_SOURCES_SOUNDCLOUD=false \
    LAVALINK_SERVER_SOURCES_TWITCH=true \
    LAVALINK_SERVER_SOURCES_VIMEO=true \
    LAVALINK_SERVER_SOURCES_MIXER=true \
    LAVALINK_SERVER_SOURCES_LOCAL=false \
    LAVALINK_SERVER_SOURCES_YOUTUBE=true \
    LAVALINK_SERVER_SOURCES_BANDCAMP=false \
    LAVALINK_SERVER_SENTRY_DNS= \
    LAVALINK_SERVER_BUFFER_DURATION_MS=400 \
    LAVALINK_SERVER_YOUTUBE_PLAYLIST_LOAD_LIMIT=250

CMD ["java", "-jar", "Lavalink.jar"]