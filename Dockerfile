FROM nginx:alpine
COPY . /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
RUN apk add --no-cache bash
RUN chmod +x env.sh

EXPOSE 80
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh $API_URL $MATCHBOX_API && nginx -g \"daemon off;\""]
