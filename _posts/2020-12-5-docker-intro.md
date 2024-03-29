---
layout: post
title: "Docker: Gluing Together Stuff I Don't Understand"
excerpt: Docker is a tool for building and running applications, with all its dependencies, in an isolated environment. It's free, open-source, and runs on pretty much anything Linux. As of February 2020, there were over 6 million repositories on Docker hub. 6 million packaged applications all ready to be downloaded and used. The Docker ecosystem is huge. 
image: docker-cover.png
---

Docker is a tool for building and running applications, with all its dependencies, in an isolated environment. It's free, open-source, and runs on pretty much anything Linux. As of February 2020, there were over [6 million](https://www.docker.com/blog/introducing-the-docker-index/) repositories on Docker hub. 6 million packaged applications all ready to be downloaded and used. The Docker ecosystem is huge. 

# Goals
With this article I want you to:
1. Understand what makes Docker useful
2. Be able to get a Wordpress site up and running 
3. Peek underneath the hood of Docker
4. Know where to go from here

{% include image.html url="https://imgs.xkcd.com/comics/containers.png" description="The world of Docker is not without its skeptics." %}

# What makes Docker special?

I like to imagine the origin of Docker as this:

Developer: "It works on my machine!"

Supervisor: "Well, we can't ship your machine to production!"

Developer: Unless...

Developer: "So yeah, not sure why it only works on my machine, but I created this tool that allows me to deploy my machine to production. Problem solved!"

It sounds ridiculous, and it is, but the ramifications were huge. Applications could be bundled with all of their dependencies. Config could be handled by the developer, not the user. People started to run with it.

People could A/B test similar applications quickly -- without worrying about the implementation of each. They could run the applications without worrying about polluting their host machine. As soon as they were done with an application, they could remove it. The application was completely compartmentalized. The barrier to entry was dramatically reduced. People could spend more time developing their ideas rather than setting up someone else's.

Let me show you what I mean.

# Getting started with Docker

## Installing Docker

Many cloud providers now have operating systems with Docker pre-installed. I've personally used Digital Ocean, and with a couple of clicks I was up and running. If you'd like to install Docker locally though, instructions can be found here: [https://curiosityweek2020.sched.com/](https://curiosityweek2020.sched.com/). If you're using Ubuntu, the instructions can be specifically found here: [https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository). If you're a Windows user, I've also found it to work really well with WSL2.

## Running Docker

With Docker installed, we'll start pretty basic: a simple Wordpress site. Sure, there are a lot of Wordpress hosting services, but we want to do this ourselves. Normally, we'd need to download PHP, Apache, and MySQL and configure them all properly (especially Apache). If you're like me, something inevitably goes wrong *every* time. (The number of times I've forgotten to increase the MAX_POST_SIZE in PHP is way too high...)

With Docker, it's much simpler. Only three commands. 

One to setup our network (so our containers can talk to each other):

```bash
docker network create wordpress
```

One to run our MySQL container:

```bash
sudo docker run --name mysql --network=wordpress -e MYSQL_ROOT_PASSWORD=wordpress -e MYSQL_DATABASE=wordpress -e MYSQL_USER=wordpress -e MYSQL_PASSWORD=wordpress -d mysql:latest
```

Breakdown:
1. `docker run` tells Docker we want to start a container
2. `--name mysql` names the container
3. `--network=wordress` connect to the "wordpress" network (so that it can communicate with other containers on the network)
4. `-e MYSQL_ROOT_PASSWORD=wordpress -e MYSQL_DATABASE=wordpress -e MYSQL_USER=wordpress -e MYSQL_PASSWORD=wordpress` sets mysql user/password/database
5. `-d` run the container in the background
6. `mysql:latest` use the latest mysql docker image

And one to run the Wordpress application with Apache and PHP:

```bash
sudo docker run --name wordpress --network=wordpress -p 80:80 -d wordpress:latest
```

Command breakdown:
1. `docker run` tells Docker we want to start a container
2. `--name wordpress` names the container
3. `--network=wordpress` connect to the "wordpress" network (so that it can communicate with other containers on the network)
4. `-p 8000:80` forward host port 8000 to container port 80 (so we can access http://localhost:8000 in our browser and it'll route us to the container)
5. `-d` run the container in the background
6. `wordpress:latest` use the latest wordpress docker image

If you're running these commands locally, you'll be able to access http://localhost to access your new site. If not, simply replace "localhost" with the IP address of the machine Docker is on. It's that easy. 

### Running Docker without the command line (and other ways to make life easier)

For those of you that wish to avoid the command line as much as possible, Docker also offers a solution. [Portainer](https://www.portainer.io/) is a Docker image that allows you to manage your containers through a web UI. 

With just one more command:

```bash
sudo docker run --name=portainer -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -d portainer/portainer-ce
```

You can start managing your containers without even touching the command line. Docker not only helps you create applications for end-users, it helps you build out your own infrastructure to make development easier. You can build out your dev-ops pipeline like Legos. And this is really where you can take your development to the next level. You can easily install tools to organize, deploy, and understand your custom application.

#### Other tools I've found useful:
1. [Jenkins](https://hub.docker.com/r/jenkins/jenkins) (Continous integration)
2. [Logstash](https://hub.docker.com/_/logstash) (Application logging) along with [Elasticsearch](https://hub.docker.com/_/elasticsearch) and [Kibana](https://hub.docker.com/_/kibana)
3. [Redmine](https://hub.docker.com/_/redmine) (Project management)

#### Bonus tool

Docker doesn't have to *just* be about development either, there are fun things too. Try running:

```bash
sudo docker run --name=mario -p 8600:8080 -d pengbai/docker-supermario
```

and navigate your web browser to http://localhost:8600 to play infinite mario.

# What is Docker?

Really, I think the answer is a bit boring: Docker is just an abstraction. It's a tool to give developers an easy-to-use interface to create and manage containers. 

Still, it's interesting to know what we're working with. Docker comes in two parts: the client and the server. 

## Docker Client

The client are the commands you run: `docker run`, `docker pull`, `docker ps`, etc. 

## Docker Daemon (Server)

The commands communicate with the server, or Docker daemon, which runs in the background and does all of the actual heavy lifting. 

## Clicent-Server Communcation

After running a command, the Docker client sends the message to Docker's socket (/var/run/docker.sock). The communication is done through a REST API. 

Fun fact: Because Docker uses a REST API, [curl can actually be used as a Docker client.](https://superuser.com/questions/834307/can-curl-send-requests-to-sockets) 

Containerization is really the underlying technology that's interesting here though.

# What are containers and containerization?

Conceptually, I think containers make sense to most people. They "contain" an application and its dependencies, but anything deeper than that always seemed like magic to me. It wasn't until I took a deeper look and tried creating my own "pseudo-container" (I'll call it a faketainer) that things started to fit into place.

## Creating our own "faketainer" without Docker

So real containerization is a bit more complicated than this. Real containers isolate processes from each other, create networks, and delegate resources specifically. Our faketainer does none of that. However, our faketainer is a lot easier to visualize and understand, and will really help get you "half-way there."

Here are the commands to create our faketainer:

```bash
#!/bin/sh

# Pull apk-tools-static
curl -LO http://dl-cdn.alpinelinux.org/alpine/latest-stable/main/x86_64/apk-tools-static-2.10.5-r1.apk
tar -xzf apk-tools-static-*.apk

# Create rootfs
./sbin/apk.static -X http://dl-cdn.alpinelinux.org/alpine/latest-stable/main -U --allow-untrusted -p rootfs --initdb add alpine-base

# Setup resolv.conf to enable networking in rootfs
cp -L /etc/resolv.conf rootfs/etc/

# Setup apk repositories so we can pull packagages in rootfs
mkdir -p rootfs/etc/apk
echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" > rootfs/etc/apk/repositories
echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" >> rootfs/etc/apk/repositories

# Cleanup leftovers on "host"
rm -rf ./sbin apk-tools-static-2.10.5-r1.apk
```

For this faketainer, I've chosen [Alpine Linux](https://alpinelinux.org/) as the base. Alpine Linux is used often in containers because it's an incredibly small distro, but still comes along with an easy to use package manager. If you're interested in finding out more, check out: [You Should Use Alpine Linux Instead of Ubuntu](https://hackernoon.com/you-should-use-alpine-linux-instead-of-ubuntu-yb193ujt)

After running this script, a directory called "rootfs" should have been created. We can then chroot (change root directory) to it:

```bash
chroot rootfs ash
```

to enter our faketainer. To demonstrate, let's install PHP into our container by running:

```bash
apk add php
```

Once complete, we can run:

```bash
php --version
```

And see:

```bash
PHP 7.3.25 (cli) (built: Nov 26 2020 13:43:59) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.3.25, Copyright (c) 1998-2018 Zend Technologies
```

But if we "log out" (Ctrl+D) from our container, and run the same command on our host:

```bash
Command 'php' not found, but can be installed with:

sudo apt install php7.4-cli
```

It can't be found. We've successfully "containerized" PHP! At a high-level, this is what Docker is doing. 

# What's next?

## Docker Compose

The example Docker commands are fairly long and involve a lot of different parameters and settings to work right. [Docker Compose](https://docs.docker.com/compose/) gives us a way to put all of that complexity into a simple file to make them easier to run. I almost always use Docker Compose to run my images. 

For example, with our Wordpress site, we had to run a couple of commands that each had a bit of configuration to them. Instead, we could have written a Docker Compose file:

```yml
version: '3.3'

services:
   mysql:
     image: mysql:latest
     environment:
       MYSQL_ROOT_PASSWORD: wordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "80:80"
```

and then run

```bash
docker-compose up -d
```

and you're done. You can then check this file into your version control system to make for an easy to use, and repeatable process to build out your infrastructure. In a way, [IaC](https://en.wikipedia.org/wiki/Infrastructure_as_code)


## Creating custom images with Dockerfiles

While I think the faketainer is cool, it's a little "hacky." Docker images are created with "Dockerfiles." Text files that describe, step by step, what the file structure of the container should look like. Find out more about [Dockerfiles](https://docs.docker.com/engine/reference/builder/).

## Kubernetes

For Kubernetes, I like to imaging the same developer who came up with Docker:

Developer: "Man, deploying my machine to production was awesome. It's too bad I still have to worry about these servers..."

Supervisor: "Yeah, just a fact of life. You can't deploy to the aether!"

Developer: Unless...

As so [Kubernetes](https://kubernetes.io/) was born.

Kubernetes allows us to manage our containers across multiple machines. This is incredibly useful in scaling applications and creating server redundancy. If one server shuts down, Kubernetes can be set up to move the containers to another, still running, server. It also allows us to use the resources from multiple computers rather than one super-powerful computer. It puts an abstraction layer across ever server, so that we can treat all of our servers as "the cloud." With Kubernetes, software engineers have lost all credibility with hardware engineers. Still awesome though.

# Final thoughts

This article was inspired by a talk I wanted to give for [Curiosity week 2020](https://curiosityweek2020.sched.com/). I hope you found it helpful. If you have any feedback, I'm happy to hear it, or answer any questions you may have -- just shoot me a message on [LinkedIn](https://www.linkedin.com/in/patrickbillodeau/)!
