FROM centos:7

RUN yum -y install epel-release
RUN yum -y install python-pip
RUN yum clean all

RUN mkdir opt/vis
WORKDIR /opt/vis

ADD requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt

EXPOSE 80