# Emergency Hotline (Vanilla JS)

## 1) `getElementById`, `getElementsByClassName`, `querySelector` / `querySelectorAll` — পার্থক্য

- `getElementById(id)`
  - শুধু একটা এলিমেন্ট রিটার্ন করে (কারণ id ইউনিক হওয়ার কথা)।
  - রিটার্ন ভ্যালু `null` হতে পারে যদি এলিমেন্ট না থাকে।
  - সিলেকশনের কেবল `id` লাগে।

- `getElementsByClassName(className)`
  - একই ক্লাসের একাধিক এলিমেন্ট রিটার্ন করতে পারে।
  - রিটার্ন সাধারণত একটি “live” `HTMLCollection` টাইপ (অর্থাৎ DOM পরিবর্তন হলে কালেকশনও আপডেট হতে পারে)।
  - একাধিক ক্লাস সিলেক্ট করার জন্য সাধারণত আলাদা ভাবে handle করতে হয়; একে CSS selector-এর মতো ফ্লেক্সিবল বলা যায় না।

- `querySelector(selector)` / `querySelectorAll(selector)`
  - দুটোই CSS selector সিনট্যাক্স ব্যবহার করে।
  - `querySelector` প্রথম ম্যাচ হওয়া এলিমেন্ট রিটার্ন করে (না পেলে `null`)।
  - `querySelectorAll` সব ম্যাচ হওয়া এলিমেন্টের একটি স্ট্যাটিক `NodeList` রিটার্ন করে (লাইভ না)।
  - তাই complex selection দরকার হলে এগুলো বেশি সুবিধাজনক।

## 2) DOM-এ নতুন এলিমেন্ট তৈরি এবং ইনসার্ট কীভাবে করবেন

সাধারণভাবে ৩টা ধাপ:
1. `document.createElement("tagName")` দিয়ে নতুন এলিমেন্ট তৈরি করা।
2. `element.textContent` / `element.innerHTML` (যদি প্রয়োজন হয়) এবং `element.setAttribute(...)` দিয়ে কনটেন্ট সেট করা।
3. এরপর কোথাও ইনসার্ট করা:
   - `parent.appendChild(newEl)` (শেষে যোগ)
   - `parent.prepend(newEl)` (শুরুর দিকে যোগ)
   - `parent.insertBefore(newEl, referenceEl)` (নির্দিষ্ট এলিমেন্টের আগে)

উদাহরণ আইডিয়া: আগে parent DOM খুঁজুন, তারপর `createElement`, তারপর `appendChild`।

## 3) Event Bubbling কী এবং কীভাবে কাজ করে

Event bubbling মানে হলো—একটা এলিমেন্টে কোনো ইভেন্ট (যেমন `click`) ঘটলে, ইভেন্টটা সেই এলিমেন্ট থেকে উপরের দিকে (তার parent, grandparent, এভাবে) propagate করে।

উদাহরণ:
- যদি আপনি একটা বাটনের ভেতরে থাকা আইকনে ক্লিক করেন,
- তাহলে আগে ওই আইকনের ইভেন্ট হ্যান্ডলার চলতে পারে,
- এরপর parent element এর হ্যান্ডলার,
- এরপর আরও উপরের কন্টেইনারের হ্যান্ডলার চলতে পারে,
- যতক্ষণ না ডকুমেন্ট পর্যন্ত পৌঁছে বা stop করা হয়।

সুতরাং `event.target` (যে জায়গায় ক্লিক হয়েছে) আর `event.currentTarget` (যে এলিমেন্টে listener attach আছে) এই দুইটার পার্থক্য বোঝা গুরুত্বপূর্ণ।

## 4) Event Delegation in JavaScript — কী এবং কেন উপকারী

Event delegation হলো—প্রতিটা আলাদা এলিমেন্টে ক্লিক listener না বসিয়ে, সাধারণত parent বা container-এ একটাই listener বসিয়ে event  "উপরের দিকে আসার" প্রসেস কাজে লাগানো।

কেন উপকারী:
- নতুন DOM এলিমেন্ট যোগ হলেও আলাদা করে event listener লাগবে না (যদি parent একই থাকে)।
- অনেকগুলো বাট নঅথবা কার্ড থাকলে পারফরম্যান্স এবং কোডের পরিমাণ কমে।
- ডাইনামিক UI (যেমন call history তে নতুন row যোগ হওয়া) সহজ হয়।

Delegation চালাতে সাধারণত `event.target` বা `event.target.closest(...)` ব্যবহার করে বোঝা হয় আসল ক্লিকটা কোন child element-এ হয়েছে।

## 5) `preventDefault()` VS `stopPropagation()` — পার্থক্য

- `preventDefault()`
  - ব্রাউজারের ডিফল্ট action আটকায়।
  - যেমন: `<a href="...">` লিংকে ক্লিক করলে পেজ নেভিগেট করা, অথবা ফর্ম সাবমিট হওয়া—এগুলো ডিফল্ট।
  - এটি “ইভেন্টকে থামায় না”, শুধু ডিফল্ট আচরণ বন্ধ করে।

- `stopPropagation()`
  - ইভেন্ট capturing এর propagation থামায়।
  - তাই parent বা অন্য ancestor-এর listener আর ট্রিগার হবে না (propagate হবে না)।
  - কিন্তু ডিফল্ট action চলতে পারে—যদি আপনি আলাদা করে `preventDefault()` না দেন।

`preventDefault()` ডিফল্ট আচরণ বন্ধ করে, আর `stopPropagation()` ইভেন্ট কোথায় propagate হবে সেটা বন্ধ করে।

