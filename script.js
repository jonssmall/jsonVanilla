const baseUrl = "https://jsonplaceholder.typicode.com";
getUsers();

function makeDropdown(usersData) {
  const selectElement = document.createElement("select");

  selectElement.addEventListener("change", (e) => {
    getUserPosts(e.target.value);
  });

  selectElement.innerHTML = `<option disabled selected value>Select</option>` + usersData.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  document.querySelector('#users').appendChild(selectElement);
}

function makePostList(postsData) {

  const commentCalls = postsData.map(p => axios.get(`${baseUrl}/post/${p.id}/comments`));

  postsData.forEach(post => {
    post.comments = [];
  });

  axios.all(commentCalls)
    .then(axios.spread(function (...results) {
      const allComments = results.reduce((acc, result) => {
        acc = acc.concat(result.data);
        return acc;
      }, []);
      for (let i = 0; i < allComments.length; i++) {
        const comment = allComments[i];
        comment.approved = false;
        const matchingPost = postsData.find(post => post.id === comment.postId);
        matchingPost.comments.push(comment);
      }
      console.log(postsData);
    }));

  const postDiv = document.querySelector('#posts');
  postDiv.innerHTML = postsData.map(makePost).join('');
}

/*
post
{
  body: ''
  title: ''
  comments: [
    {
      name: '',
      email: '',
      body: ''
      approved: false
    }
  ]
}
*/

function makePost(postData) {
  return `
    <div id="post-${postData.id}">
      <h1>${postData.title}</h1>
      <p>${postData.body}</p>
    </div>
  `;
}

function getUsers() {
  get(`${baseUrl}/users`, makeDropdown);
}

function getUserPosts(userId) {
  get(`${baseUrl}/users/${userId}/posts`, makePostList);
}

function getPostComments(postId) {
  get(`${baseUrl}/post/${postId}/comments`, console.log);
}

function get(url, callback) {
  axios.get(url)
    .then(function (response) {
      callback(response.data);
    })
    .catch(logError);
}

function logError(error) {
  console.log(error);
}

/*

{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  }
}
*/