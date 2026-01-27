const button = document.getElementById("searchBtn");
const profileDiv = document.getElementById("profile");

button.addEventListener("click", async () => {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim(); // remove extra spaces

  profileDiv.innerHTML = ""; // clear previous results

  if (!username) {
    profileDiv.innerHTML = `<p style="color:red">Please enter a username</p>`;
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${username}`,
    );

    if (!response.ok) {
      throw new Error("User not found");
    }

    profileDiv.innerHTML = "";

    const data = await response.json();

    data.items.forEach((user) => {
      profileDiv.innerHTML += `
    <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white  border border-blue-600/70 shadow-lg flex flex-col items-center justify-center ">
      <img src="${user.avatar_url}" width="150" alt="Profile Picture" />
      <h3>${user.id || "No name available"}</h3>
      <p><strong>Username:</strong> @${user.login}</p>
      
     
      <p class="mb-2"><strong>User view:</strong> ${user.user_view_type}</p>
      <p><a href="${user.html_url}" target="_blank" class="bg-purple-400 rounded p-1 text-sm text-slate-800 font-medium">View on GitHub</a></p>
       </div>
    `;
    });
  } catch (error) {
    profileDiv.innerHTML = `<p style="color:red">${error.message}</p>`;
  }
});

// <p><strong>Bio:</strong> ${user.bio || "No bio available"}</p>
//  <p><strong>Public Repos:</strong> ${user.public_repos}</p>
//       <p><strong>Followers:</strong> ${user.followers}</p>
