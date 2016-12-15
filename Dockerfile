FROM centos:7

RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

RUN yum -y install gcc-c++ make
RUN yum -y install epel-release
RUN yum -y install nodejs
RUN yum -y install nginx
RUN yum clean all

RUN npm install -g gulp-cli

ARG WORKDIR=/opt/vis
RUN mkdir $WORKDIR
ADD package.json $WORKDIR/package.json
ADD gulpfile.js $WORKDIR/gulpfile.js
ADD src $WORKDIR/src
WORKDIR $WORKDIR

RUN npm install --unsafe-perm

ADD nginx.conf /etc/nginx/nginx.conf

CMD /usr/sbin/nginx

EXPOSE 80