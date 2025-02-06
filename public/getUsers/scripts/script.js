let allUsers = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  // Event listener for search
  document.getElementById('search').addEventListener('input', filterUsers);
});

async function fetchUsers() {
  try {
    const response = await fetch('/api/admin/users', { method: 'GET' });
    const data = await response.json();
    if (data.status === 'success') {
      allUsers = data.data; // Store all users
      displayUsers(allUsers);
    } else {
      console.log(data.message);
    }
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

function displayUsers(users) {
  const tbody = document.getElementById('user-table-body');
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.classList.add('border-b', 'hover:bg-gray-50');

    tr.innerHTML = `
      <td class="px-6 py-4 text-sm text-gray-600">${user._id}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${user.name}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${user.email}</td>
      <td class="px-6 py-4 text-sm text-gray-600">
        <span class="${user.isLogged ? 'text-green-500' : 'text-red-500'}">${user.isLogged ? 'Online' : 'Offline'}</span>
      </td>
      <td class="px-6 py-4 text-sm text-gray-600">
        <button onclick="openEditModal('${user._id}', '${user.name}', '${user.email}', '', ${user.isLogged})" class="text-yellow-500 hover:text-yellow-700">Edit</button>
        <button onclick="deleteUser('${user._id}')" class="text-red-500 hover:text-red-700 ml-4">Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function filterUsers(e) {
  const searchQuery = e.target.value.toLowerCase();
  const filteredUsers = allUsers.filter(user => {
    return user.name.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery);
  });

  displayUsers(filteredUsers); // Display filtered users
}

function openEditModal(id, name, email, password, isLogged) {
  const modal = document.getElementById('edit-modal');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const isLoggedSelect = document.getElementById('isLogged');

  nameInput.value = name;
  emailInput.value = email;
  passwordInput.value = password;
  isLoggedSelect.value = isLogged;

  modal.classList.remove('hidden');

  document.getElementById('edit-user-form').onsubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      isLogged: isLoggedSelect.value === 'true'
    };

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });

      const data = await response.json();
      if (data.status === 'success') {
        showAlert('User updated successfully!', 'success');
        fetchUsers();
        closeEditModal();
      } else {
        showAlert(data.message, 'error');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      showAlert('An error occurred while updating the user.', 'error');
    }
  };
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

async function deleteUser(id) {
  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (confirmDelete) {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.status === 'success') {
        showAlert('User deleted successfully!', 'success');
        fetchUsers(); // Reload the user list
      } else {
        showAlert(data.message, 'error');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      showAlert('An error occurred while deleting the user.', 'error');
    }
  }
}

function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `fixed top-4 right-4 z-50 p-4 text-sm rounded-lg shadow-md ${
    type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`;

  alert.innerText = message;
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

document.getElementById('close-modal').addEventListener('click', closeEditModal);
document.getElementById('cancel-edit').addEventListener('click', closeEditModal);
