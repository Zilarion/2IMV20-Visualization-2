FROM centos:7

RUN yum -y install epel-release
RUN yum -y install python-pip
RUN yum clean all

ARG WORKDIR=/opt/vis
ADD . $WORKDIR
WORKDIR $WORKDIR

ADD requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt

ADD load_data.py load_data.py

CMD python ./load_data.py