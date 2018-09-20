FROM phusion/passenger-nodejs


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY src/package.json /usr/src/app

#USER root


#RUN npm install
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list





RUN add-apt-repository ppa:jonathonf/tesseract 
RUN apt-get update 
# RUN apt-get dist-upgrade 
RUN apt-get install -y --no-install-recommends ffmpeg

RUN apt-get install yarn

RUN yarn install


COPY src/ /usr/src/app
# RUN npm install -g npm@5.6.0
RUN npm install -g npm@latest
RUN npm install -g nodemon

#RUN ls
#RUN npm install -g nodemon
#RUN yarn add global nodemon

RUN apt-get install -y mongodb-org

#RUN npm install nodemon 


RUN mkdir /data
RUN mkdir /data/db  
RUN mkdir /data/db/log

EXPOSE 3000


ENV PATH="/usr:${PATH}"
RUN export PATH

#CMD nodemon .
CMD node .