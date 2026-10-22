# Sketchnote Visual Notes Developer Guide & Component Reference

## ১. ভূমিকা ও ব্যবহারের উদ্দেশ্য
**Sketchnote Visual Notes** হলো বিসিএস লাইভ এমসিকিউ স্মার্ট ই-বুকের জন্য একটি খাঁটি **Pure CSS ও Pure HTML** ভিত্তিক ঐচ্ছিক ও প্রসঙ্গনির্ভর ডিজাইন স্তর।

### মূল দর্শন:
1. **ঐচ্ছিক ও প্রসঙ্গনির্ভর:** প্রতিটি অধ্যায়ে ব্যবহার বাধ্যতামূলক নয়। কোনো কোটা নেই। কেবল যেখানে কোনো সূত্র, তুলনা, ধাপে ধাপে প্রক্রিয়া বা মনে রাখার মতো বিশেষ পয়েন্ট আছে সেখানে মিতব্যয়ীভাবে ব্যবহার করতে হবে।
2. **Zero Fabrication:** কোনো নতুন তথ্য, তত্ত্ব, সাল বা উদাহরণ মনগড়া যোগ করা যাবে না। কেবল অধ্যায়ের বিদ্যমান প্রামাণ্য তথ্যকে সাজিয়ে দেখানো যাবে।
3. **Additive Layer:** মূল `.q-card` কুইজ ইঞ্জিন, প্রশ্নসংখ্যা, অপশন এবং বিশদ ব্যাখ্যা অক্ষত থাকবে।

---

## ২. ফন্ট সেটআপ ও বাংলা হ্যান্ডরাইটিং সীমাবদ্ধতা

### ২.১ বর্তমান ফন্ট স্ট্রাকচার
`sketchnote.css`-এ গুগল ফন্টস প্রি-লোড করা রয়েছে:
```css
:root {
  --sk-font-bn: 'Atma', 'Baloo Da 2', 'Hind Siliguri', 'Noto Serif Bengali', cursive, sans-serif;
  --sk-font-en: 'Caveat', 'Patrick Hand', 'Kalam', cursive, sans-serif;
}
```

### ২.২ বাংলা হ্যান্ডরাইটিং ফন্টের সীমাবদ্ধতা ও সমাধান:
- **বাস্তব সীমাবদ্ধতা:** গুগলের ফ্রি ওপেন-সোর্স ফন্ট লাইব্রেরিতে ইংরেজিতে Caveat, Patrick Hand, Kalam-এর মতো চমৎকার ডজনখানেক পেনসিল বা মার্কার স্টাইলের ফন্ট থাকলেও, বাংলায় সত্যিকারের "হাতে আঁকা/হাতে লেখা" ফ্রি ফন্ট অত্যন্ত সীমিত।
- **উপলব্ধ ফন্ট মূল্যায়ন:**
  1. **`Atma`:** সামান্য বাঁকানো ও চঞ্চল, মার্কার দিয়ে লেখার কিছুটা অনুভূতি দেয় (বর্তমান ডিফল্ট)।
  2. **`Baloo Da 2`:** তুলনামূলক গোলগাল ও ডিসপ্লে টাইপোগ্রাফির জন্য চমৎকার।
  3. **`Galada`:** টানা হাতের লেখার মতো হলেও কিছু যুক্তাক্ষরে সাধারণ পড়ার গতি কমাতে পারে।
  4. **`Hind Siliguri` / `Noto Serif Bengali`:** পরিষ্কার প্রমিত ফন্ট, কোনো বিশেষ হ্যান্ডরাইটিং ফন্ট লোড না হলে নিরাপদ ফলব্যাক।

### ২.৩ কাস্টম অফলাইন ফন্ট যুক্ত করার সহজ নিয়ম:
আপনি যদি লিপিঘর বা অন্য কোনো সোর্স থেকে প্রিমিয়াম বাংলা হ্যান্ডরাইটিং ফন্ট (যেমন: `Lipighor Handwritten.woff2`) ব্যবহার করতে চান, তবে `sketchnote.css`-এর শীর্ষে নিচের কোড যুক্ত করলেই পুরো লাইব্রেরিতে নতুন ফন্ট চালু হয়ে যাবে:

```css
@font-face {
  font-family: 'MyBanglaHand';
  src: url('fonts/MyBanglaHand.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --sk-font-bn: 'MyBanglaHand', 'Atma', cursive, sans-serif;
}
```

---

## ৩. কম্পোনেন্ট তালিকা ও ব্যবহারের স্নিপেট

### ১) পেজ র‍্যাপার (Page Wrappers)
রুলড খাতার পাতা, গ্রিড খাতা অথবা স্পাইরাল কয়েল নোটবুকের জন্য:
```html
<!-- রুল টানা খাতার পাতা (বামে লাল মার্জিন লাইন) -->
<section class="sk-page">
  ...
</section>

<!-- গ্রিড পেপার ভ্যারিয়েন্ট -->
<section class="sk-page sk-page--grid">
  ...
</section>

<!-- স্পাইরাল নোটবুক বাইন্ডিং (বামে কয়েল ছিদ্র) -->
<section class="sk-page sk-page--spiral">
  ...
</section>

<!-- পার্চমেন্ট প্রাচীন পেপার (নেভি ও সোনালি থিম) -->
<section class="sk-page sk-theme-parchment">
  ...
</section>
```

---

### ২) হ্যান্ড-ড্রন বক্স (Hand-drawn Wobbly Boxes)
অসম কোণ ও পেন্সিল স্ট্রোকের বক্স:
```html
<div class="sk-box">সাধারণ পেন্সিল বক্স</div>
<div class="sk-box sk-box--blue">নীল বর্ডার বক্স</div>
<div class="sk-box sk-box--green">সবুজ বর্ডার বক্স</div>
<div class="sk-box sk-box--orange">কমলা বর্ডার বক্স</div>
<div class="sk-box sk-box--purple">বেগুনি বর্ডার বক্স</div>
<div class="sk-box sk-box--red">লাল বর্ডার বক্স</div>
<div class="sk-box sk-box--dashed">ড্যাশড বর্ডার বক্স</div>
```

---

### ৩) শিরোনাম ও সেকশন হেড
```html
<!-- ডাবল আন্ডারলাইন শিরোনাম -->
<div class="sk-title">মূল অধ্যায় বা বিষয়ের শিরোনাম</div>

<!-- পেন্সিল আইকন ও দুই পাশে রঙিন লাইনযুক্ত সেকশন হেড -->
<div class="sk-section-head">১. প্রথম পর্যায় ও মূল ধারণা</div>

<!-- সংখ্যাযুক্ত ব্যাজ ও বক্স -->
<div class="sk-numbered sk-numbered--green">
  <span class="sk-numbered__badge">১</span>
  <div class="sk-numbered__content">
    <div class="sk-box sk-box--green">
      এখানে পয়েন্ট বা বিবরণ...
    </div>
  </div>
</div>
```

---

### ৪) পুশপিন স্টিকি নোট (Sticky Note with Pin)
```html
<!-- হলুদ স্টিকি নোট ও পুশপিন -->
<div class="sk-sticky sk-sticky--yellow">
  <span class="sk-pin"></span>
  <strong>মনে রাখুন:</strong>
  <p>অধ্যায়ের বিদ্যমান গুরুত্বপূর্ণ তথ্য...</p>
</div>

<!-- নীল স্টিকি নোট -->
<div class="sk-sticky sk-sticky--blue">
  <span class="sk-pin sk-pin--purple"></span>
  <strong>সতর্কতা:</strong>
  <p>ব্যতিক্রমী তথ্য...</p>
</div>
```

---

### ৫) মার্কার হাইলাইটার ও টেক্সট কালার
```html
<!-- হাইলাইটার স্ট্রোক -->
<mark class="sk-mark sk-mark--yellow">হলুদ হাইলাইট</mark>
<mark class="sk-mark sk-mark--pink">গোলাপি হাইলাইট</mark>
<mark class="sk-mark sk-mark--green">সবুজ হাইলাইট</mark>
<mark class="sk-mark sk-mark--blue">নীল হাইলাইট</mark>

<!-- রঙিন শব্দ -->
<span class="sk-c-blue">নীল শব্দ</span>
<span class="sk-c-green">সবুজ শব্দ</span>
<span class="sk-c-orange">কমলা শব্দ</span>
<span class="sk-c-purple">বেগুনি শব্দ</span>
<span class="sk-c-red">লাল শব্দ</span>

<!-- হাতে আঁকা আন্ডারলাইন -->
<span class="sk-underline">ঢেউখেলানো আন্ডারলাইন</span>
<span class="sk-doodle-underline">কমলা স্ট্রোক আন্ডারলাইন</span>
```

---

### ৬) চেকলিস্ট ও তীর-তালিকা
```html
<!-- রঙিন তীর বুলেট তালিকা -->
<ul class="sk-arrow-list">
  <li><span class="sk-c-green">পয়েন্ট ১</span> ➔ বিবরণ...</li>
  <li><span class="sk-c-orange">পয়েন্ট ২</span> ➔ বিবরণ...</li>
</ul>

<!-- হাতে আঁকা চেকলিস্ট -->
<ul class="sk-checklist">
  <li class="sk-done"><span class="sk-check-box"></span> সম্পন্ন হওয়া পয়েন্ট (সবুজ টিক)</li>
  <li><span class="sk-check-box"></span> সাধারণ পয়েন্ট (খালি বক্স)</li>
</ul>
```

---

### ৭) রেসপনসিভ টেবিল
সব টেবিল অবশ্যই `<div class="table-responsive">` দিয়ে র‍্যাপ করতে হবে।
```html
<!-- স্ট্যান্ডার্ড স্কেচনোট টেবিল -->
<div class="table-responsive">
  <table class="sk-table">
    <thead>
      <tr>
        <th>বিষয়</th>
        <th>বিবরণ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>তথ্য ১</td>
        <td>ব্যাখ্যা ১</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- রিভিশন লং টেবিল (সংকীর্ণ ক্রম কলাম ও লালচে-বাদামি লাইন) -->
<div class="table-responsive">
  <table class="sk-table sk-table--long">
    <thead>
      <tr>
        <th>ক্রম</th>
        <th>বিষয়</th>
        <th>কীভাবে মনে রাখবেন</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>১</td>
        <td>চর্যাপদ</td>
        <td>প্রাচীনতম বাংলা কবিতা সংকলন</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- তুলনামূলক ছক (পার্চমেন্ট স্টাইল) -->
<div class="table-responsive">
  <table class="sk-compare">
    <thead>
      <tr>
        <th>তুলনার ক্ষেত্র</th>
        <th>পক্ষ ক</th>
        <th>পক্ষ খ</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>উৎস</td>
        <td>তথ্য ক</td>
        <td>তথ্য খ</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### ৮) সূত্র, সমীকরণ ও পিল
```html
<!-- বড় কেন্দ্রীয় ফর্মুলা বক্স -->
<div class="sk-formula">
  A + B = C
</div>

<!-- সমীকরণ ক্যাপসুল -->
<div class="sk-equation">
  <span>উপাদান ১</span> + <span>উপাদান ২</span> = <span>ফলাফল</span>
</div>

<!-- ড্যাশড লেজেন্ড বক্স -->
<div class="sk-defbox">
  <span class="sk-c-purple">সংজ্ঞা:</span> বিষয়টির নির্দিষ্ট বিবরণ...
</div>

<!-- মান বা সেশন পিল -->
<span class="sk-pill">৪২তম বিসিএস</span>
<span class="sk-pill">E10 / E20</span>
```

---

### ৯) কি-পয়েন্ট, মনে রাখুন ও সারসংক্ষেপ
```html
<!-- কি-পয়েন্ট স্ট্রিপ (বাল্ব আইকন ও ৩টি টিক পয়েন্ট) -->
<div class="sk-keystrip">
  <div class="sk-keystrip__icon">💡</div>
  <div class="sk-keystrip__points">
    <div class="sk-keystrip__item">পয়েন্ট ১</div>
    <div class="sk-keystrip__item">পয়েন্ট ২</div>
    <div class="sk-keystrip__item">পয়েন্ট ৩</div>
  </div>
</div>

<!-- মনে রাখুন বক্স -->
<div class="sk-remember">
  এখানে মনে রাখার মতো বিশেষ তথ্য থাকবে।
</div>

<!-- বিসিএস স্পেশাল বক্স -->
<div class="sk-remember sk-remember--blue">
  বিসিএস প্রিলিমিনারি ও লিখিত পরীক্ষার জন্য গুরুত্বপূর্ণ পয়েন্ট।
</div>

<!-- সারসংক্ষেপ লাইন -->
<div class="sk-conclusion">
  সারসংক্ষেপ: বিষয় ১ ➔ বিষয় ২ ➔ বিষয় ৩
</div>
```

---

### ১০) ফ্লোচার্ট ও প্রসেস (Process Flows)
ডেস্কটপে পাশাপাশি (Horizontal) এবং মোবাইলে স্বয়ংক্রিয়ভাবে নিচে নিচে (Vertical) রূপান্তর হবে:
```html
<div class="sk-flow sk-flow--chips">
  <div class="sk-flow__step">ধাপ ১</div>
  <span class="sk-arrow"></span>
  <div class="sk-flow__step">ধাপ ২</div>
  <span class="sk-arrow"></span>
  <div class="sk-flow__step">ধাপ ৩</div>
</div>
```

---

## ৪. ডার্ক মোড ও রেসপনসিভ আচরণ
- **ডার্ক মোড:** লাইব্রেরিটি স্বয়ংক্রিয়ভাবে `data-theme="dark"`, `body.dark-mode` বা `body.dark-theme`-এর সাথে খাপ খাইয়ে নেয়। কাগজের ব্যাকগ্রাউন্ড পরিণত হয় গাঢ় নেভি-গ্রে স্ল্যাব এবং কালির রঙ চকের মতো হালকা হোয়াইট-ব্লু রঙে রূপান্তরিত হয়।
- **মোবাইল সেফগার্ড:** প্রতিটি টেক্সট ও উপাদানে `box-sizing: border-box`, `max-width: 100%` এবং `overflow-x: clip` নিশ্চিত করা হয়েছে, ফলে স্ক্রিনে কোনো হরিজন্টাল স্ক্রলবার তৈরি হবে না।
