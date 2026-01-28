const button = document.getElementById("searchBtn");
const profileDiv = document.getElementById("profile");
const input = document.getElementById("username");

button.addEventListener("click", fetchUsers);
input.addEventListener("keyup", fetchUsers);

async function fetchUsers() {
  const username = input.value.trim();
  profileDiv.innerHTML = "";

  if (!username) {
    profileDiv.innerHTML = `<p class="text-red-500 col-span-full">Please enter a username</p>`;
    return;
  }

  try {
    // Search for users with fuzzy matching, limit to 5 results
    const response = await fetch(
      `https://api.github.com/search/users?q=${username}&per_page=5`,
    );
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      throw new Error("Something went wrong");
    }

    const data = await response.json();

    if (data.total_count === 0) {
      profileDiv.innerHTML = `<p class="col-span-full">No users found</p>`;
      return;
    }

    // Display each matched user
    for (const user of data.items) {
      const userResponse = await fetch(
        `https://api.github.com/users/${user.login}`,
      );
      if (!userResponse.ok) continue; // skip if failed

      const userData = await userResponse.json();

      profileDiv.innerHTML += `
              <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center
                          border border-blue-600/70 shadow-lg flex flex-col items-center">

                <img src="${userData.avatar_url}" class="w-28 h-28 rounded-full mb-4" />
                <h3 class="text-lg font-semibold">${userData.name || "No name"}</h3>
                <p class="text-sm text-purple-300">@${userData.login}</p>
                <p class="text-sm mt-2">${userData.bio || "No bio available"}</p>

                <div class="flex justify-center items-center text-center bg-indigo-100 border text-slate-800 text-xs gap-4 mt-4 rounded p-2">
                  <span>👥 Followers ${userData.followers}</span>
                  <span>➡️ Following ${userData.following}</span>
                  <span>📦 Repos ${userData.public_repos}</span>
                </div>

                <a href="${userData.html_url}" target="_blank"
                   class="mt-4 bg-purple-400 rounded px-3 py-1 text-sm
                          text-slate-900 font-medium hover:bg-purple-500">
                  View on GitHub
                </a>
              </div>
            `;
    }
  } catch (error) {
    profileDiv.innerHTML = `<p class="text-red-500 col-span-full">${error.message}</p>`;
  }
}
