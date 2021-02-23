const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

let currentItem = null;

const fetchTodo = async () => {
  const row = document.getElementById('todo-data')
  row.innerHTML = '';
  const url = 'http://localhost:8000/api/todo/list/';
  try {
    const response = await fetch(url);
    const items = await response.json();
    items.map((item) => {;
        row.innerHTML += `
            <li class="list-group-item" style="display: flex">
                <div style="flex:7">
                    <span>${item.text}</span>
                </div>
                <div style="flex:1">
                    <button class="btn btn-sm btn-info" onclick="editTodo('${item.id}', '${item.text}')">
                        Edit
                    </button>
                </div>
                <div style="flex:1">
                    <button class="btn btn-sm btn-danger" onclick="deleteTodo('${item.id}')">
                        Remove
                    </button>
                </div>
            </li>
        `;
    });
  }
  catch (error) {
    console.error(error)      
  }
};

//Form Submission Handling 
const form = document.getElementById('form-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('text').value;
  const methodState = currentItem === null ? 'POST' : 'PUT';
  let url = 'http://localhost:8000/api/todo/list/';

  if(currentItem !== null){
      url = `http://localhost:8000/api/todo/detail/${currentItem}`;
      currentItem = null;
  }
  try {
    const response = await fetch(url, {
    method: methodState,
    headers: {
        'X-CSRFToken': csrftoken,
        'Content-type': 'application/json',
    },
    body: JSON.stringify({ text }),
    });
    fetchTodo();
    document.getElementById('form').reset();
  } catch (error) {
      console.error(error)
  }
});

const editTodo = (id, text) => {
    currentItem = id;
    document.getElementById('text').value = text;
}

const deleteTodo = async (id) => {
    url = `http://localhost:8000/api/todo/detail/${id}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
            'X-CSRFToken': csrftoken,
            'Content-type': 'application/json',
            },
        });
        fetchTodo();
    } catch (error) {
        console.error(error)
    }
}


fetchTodo()