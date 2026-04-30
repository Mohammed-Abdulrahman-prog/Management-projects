# Task Manager Project
نظام لإدارة المشاريع والمهام (Projects & Tasks)
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) 

# Technologies

* Frontend: Angular
* Backend: Node.js / Express
* Database: MySQL

# Features

* إنشاء مشروع
* إضافة مهام
* منع حذف المشروع إذا يحتوي مهام
* عرض قائمة المشاريع

# Setup

## 1. Backend

```bash
cd backend
npm install
npm start
```

## 2. Frontend

```bash
cd frontend
npm install
ng serve
```
# Database Setup

هذا القسم يوضح كيفية إنشاء قاعدة البيانات والجداول الخاصة بالمشروع.

## الطريقة الأولى (باستخدام MySQL CLI)

قم بتشغيل ملف إنشاء الجداول من خلال الأمر التالي:

mysql -u root -p < database/schema.sql

## الطريقة الثانية (باستخدام phpMyAdmin)

يمكنك أيضًا استيراد قاعدة البيانات يدويًا عبر phpMyAdmin:
افتح phpMyAdmin في المتصفح
أنشئ قاعدة بيانات جديدة (مثلاً: project_db)
اختر تبويب Import
اختر الملف: database/schema.sql
اضغط Go لتنفيذ الاستيراد

# API

* GET /projects
* POST /projects
* DELETE /projects/:id

# Author
For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
#
