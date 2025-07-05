# 🚨 VisionNext - Real-Time Object Detection with Next.js, TensorFlow.js & React Webcam

VisionNext is a real-time object detection web app using **Next.js 14**, **Tailwind CSS**, and **TensorFlow.js**. It leverages the `coco-ssd` pre-trained model and accesses your device's camera to detect objects like *people*, *bottles*, *chairs*, and more!

---

## 📸 Demo

[Live Vercel Demo](https://visionnext.vercel.app) – coming soon!

---

## 🚀 Features

- 🔍 Real-time object detection via webcam
- 🎯 Uses TensorFlow.js + COCO-SSD ML model
- 🧠 Bounding boxes with label + confidence
- 🔊 Plays alert sound when person is detected
- 🎛️ Toggle detection, switch cameras (front/rear)
- 📋 View detection logs with timestamps

---

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TensorFlow.js](https://js.tensorflow.org/)
- [COCO-SSD model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [react-webcam](https://www.npmjs.com/package/react-webcam)

---

🧠 What is TensorFlow?
TensorFlow is an open-source machine learning (ML) and deep learning (DL) framework developed by Google.
It allows developers to build, train, and deploy AI models efficiently.

🖥️ What is TensorFlow.js?
TensorFlow.js is the JavaScript version of TensorFlow.
It enables ML in the browser or on Node.js — no Python, no backend, just pure in-browser ML.

---

## 🧑‍💻 Installation & Setup

### ✅ Step 1: Create Project

```bash
npx create-next-app@latest
```
```bash
✔ Would you like to use TypeScript? → No  
✔ Would you like to use ESLint? → Yes  
✔ Would you like to use Tailwind CSS? → Yes  
✔ Would you like to use `src/` directory? → No  
✔ Would you like to use App Router? → Yes  
✔ Would you like to use Turbopack? → No  
✔ Customize import alias? → No
  
```
### ✅ Step 2:  Install Dependencies

```bash
npm install react-webcam
npm install @tensorflow-models/coco-ssd @tensorflow/tfjs

```
### ✅ Step 3:  Add Components

- Create object-detection.js inside components/
- Create render-predictions.js for drawing bounding boxes
- Use <ObjectDetection /> inside app/page.js
