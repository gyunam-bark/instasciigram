const resultBox = document.getElementById('result');

function showResult(data) {
  resultBox.textContent = JSON.stringify(data, null, 2);
}

// POST
document.getElementById('create-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const body = Object.fromEntries(form);
  body.tags = body.tags?.split(',').map(tag => tag.trim());
  body.size = Number(body.size);
  body.pixels = JSON.parse(body.pixels || '[]');
  if (!body.size || !body.pixels.length) return showResult({ error: 'size ≥ 1, pixels ≥ 1 필요' });

  try {
    const res = await axios.post('/posts', body);
    showResult(res.data);
  } catch (err) {
    showResult(err.response?.data || err.message);
  }
});

// GET ALL
document.getElementById('get-posts-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const page = Number(document.getElementById('get-page').value);
  const pageSize = Number(document.getElementById('get-pageSize').value);
  const keyword = document.getElementById('get-keyword').value.trim();

  try {
    const res = await axios.get('/posts', {
      params: {
        ...(page ? { page } : { page: 1 }),
        ...(pageSize ? { pageSize } : { pageSize: 10 }),
        ...(keyword ? { keyword } : { keyword: '' })
      }
    });
    showResult(res.data);
  } catch (err) {
    showResult(err.response?.data || err.message);
  }
});

// GET ONE
document.getElementById('get-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('get-id').value;
  if (!id) return showResult({ error: 'ID는 필수입니다.' });

  try {
    const res = await axios.get(`/posts/${id}`);
    showResult(res.data);
  } catch (err) {
    showResult(err.response?.data || err.message);
  }
});

// PATCH
document.getElementById('patch-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const id = form.get('id');
  const password = form.get('password');
  if (!id) return showResult({ error: 'id는 필수입니다.' });

  const body = Object.fromEntries(form);
  body.tags = body.tags?.split(',').map(tag => tag.trim());
  body.size = Number(body.size);
  body.pixels = body.pixels ? JSON.parse(body.pixels) : undefined;

  try {
    const res = await axios.patch(`/posts/${id}`, body);
    showResult(res.data);
  } catch (err) {
    showResult(err.response?.data || err.message);
  }
});

// DELETE
document.getElementById('delete-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('delete-id').value;
  const password = document.getElementById('delete-password').value;
  if (!id) return showResult({ error: 'id는 필수입니다.' });

  try {
    const res = await axios.delete(`/posts/${id}?password=${encodeURIComponent(password)}`);
    showResult(res.data);
  } catch (err) {
    showResult(err.response?.data || err.message);
  }
});