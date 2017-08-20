# SentiSchool

SentiSchool is an EdTech application that tracks the emotions of students in an online classroom as they watch a lecture or participate in discussion.

MOOCs have been very successful at scaling accessibility to high quality video lectures, but often lack in keeping students interested and providing nonverbal feedback to teachers as found in more traditional classrooms.

Currently, MOOCs employ exercises or surveys to measure student engagement, but these often prove to be trivial and/or biased. SentiSchool tries to address this problem by more directly measuring engagement through analyzing a webcam feed of the student. As the student watches the lecture, SentiSchool extracts his/her emotion i.e. happy, angry, sad as a proxy for whether the student is frustrated, excited, disengaged, etc. This information for each student is relayed back to the course content creator and may be useful for future content creation, personalized lessons, tracking progress, etc.

## Technical Details

SentiSchool is a Node web app that allows users to create online classrooms and host video lectures. Students will enter a classroom using a unique URL. Students can also browse an open selection of online course lectures from a range of topics.

SentiSchools reads the webcam as a video stream, samples the stream as a sequence of images, and passes each image to the [TrueFace.ai](http://trueface.ai/) API to fetch bounding box coordinates for each face within the image. Each image is then cropped (once per bounding box) to produce a set of face images.

## Emotion Net

We trained our own (Xception-based) deep neural network to predict a set of 7 emotions (anger, disgust, fear, happy, sad, surprised, neural) from each face image. See [https://github.com/mhw32/Face2Emotion](https://github.com/mhw32/Face2Emotion) for our implementation (Keras) and more details. The net was trained on the FER2013 dataset and achieves around 66% classification error (state-of-art if 71%).