import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { user, error } = await supabase.auth.signUp({ email, password });
  if(error) alert(error.message);
  else alert('تم إنشاء الحساب!');
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if(error) alert(error.message);
  else {
    alert('تم تسجيل الدخول!');
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('lessonsList').style.display = 'block';
    loadLessons();
  }
}

async function loadLessons(){
  const { data, error } = await supabase.from('lessons').select('*');
  if(error) { console.log(error); return; }

  let html = '';
  data.forEach(lesson => {
    html += `<div>
      <h4>${lesson.title}</h4>
      <p>${lesson.description}</p>
      <button onclick="viewLesson('${lesson.video_path}')">شاهد الدرس</button>
    </div>`;
  });
  document.getElementById('lessonsList').innerHTML = html;
}

async function viewLesson(videoPath){
  const { data, error } = await supabase
    .storage
    .from('lessons-videos')
    .createSignedUrl(videoPath, 3600); // رابط مؤقت 1 ساعة

  if(error) { alert('خطأ في الوصول للفيديو'); return; }

  window.open(data.signedUrl, '_blank'); // يشغل الفيديو في نافذة جديدة
}

window.signup = signup;
window.login = login;
window.viewLesson = viewLesson;