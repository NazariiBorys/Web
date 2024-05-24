import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import React from 'react';
import '@testing-library/jest-dom';

test('renders welcome message', () => {
  render(<App />);
  const welcomeMessage = screen.getByText(/Welcome to Events!/i);
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders user navigation buttons', () => {
  render(<App />);
  const editUserButton = screen.getByText(/Edit user/i);
  const createEventButton = screen.getByText(/Create Event/i);
  const signUpButton = screen.getByText(/Sign Up/i);
  const logInButton = screen.getByText(/Log In/i);
  expect(editUserButton).toBeInTheDocument();
  expect(createEventButton).toBeInTheDocument();
  expect(signUpButton).toBeInTheDocument();
  expect(logInButton).toBeInTheDocument();
});

test('renders Events Collection title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Events Collection/i);
  expect(titleElement).toBeInTheDocument();
});

test('opens and closes Edit User dropdown', async () => {
  render(<App />);

  // Open the dropdown
  const editUserButton = screen.getByText(/Edit user/i);
  fireEvent.click(editUserButton);

  const usernameInput = screen.getByPlaceholderText(/Username/i);
  expect(usernameInput).toBeInTheDocument();

  const confirmButton = screen.getByText('Confirm');
  expect(confirmButton).toBeInTheDocument();

  // Close the dropdown
  const closeButton = screen.getByText(/Close/i);
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(usernameInput).not.toBeInTheDocument();
  });
});

test('opens Create Event dropdown', async () => {
  render(<App />);

  // Open the dropdown
  const createEventButton = screen.getByText(/Create Event/i);
  fireEvent.click(createEventButton);

});

test('opens and closes Sign Up dropdown', async () => {
  render(<App />);

  // Open the dropdown
  const signUpButton = screen.getByText(/Sign Up/i);
  fireEvent.click(signUpButton);

  const usernameInput = screen.getByPlaceholderText(/Username/i);
  expect(usernameInput).toBeInTheDocument();

  const confirmButton = screen.getByText('Confirm');
  expect(confirmButton).toBeInTheDocument();
  // Close the dropdown
  const closeButton = screen.getByText(/Close/i);
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(usernameInput).not.toBeInTheDocument();
  });
});

test('opens and closes Log In dropdown', async () => {
  render(<App />);

  // Open the dropdown
  const logInButton = screen.getByText(/Log In/i);
  fireEvent.click(logInButton);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  expect(emailInput).toBeInTheDocument();

  const confirmButton = screen.getByText('Confirm');
  expect(confirmButton).toBeInTheDocument();

  // Close the dropdown
  const closeButton = screen.getByText(/Close/i);
  fireEvent.click(closeButton);

  await waitFor(() => {
    expect(emailInput).not.toBeInTheDocument();
  });
});

test('renders footer contact email', () => {
  render(<App />);
  const emailText = screen.getByText(/events@gmail.com/i);
  expect(emailText).toBeInTheDocument();
});


test('submits the form in DropdownSignUp component', async () => {
  // Mock window.alert
  const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

  // Mock fetch for events
  global.fetch = jest.fn((url) => {
    if (url.endsWith('/api/v1/events/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]) // Mocking the response data as an empty array for events
      });
    }
    if (url.endsWith('/api/v1/users/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]) // Mocking the response data as an empty array for users
      });
    }
    return Promise.reject(new Error('Unexpected URL in fetch mock'));
  });

  render(<App />);

  // Click the Sign Up button to open the dropdown
  const signUpButton = screen.getByText(/Sign Up/i);
  fireEvent.click(signUpButton);

  // Ensure the form fields are rendered
  const usernameInput = await screen.findByPlaceholderText(/Username/i);
  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText('Password');
  const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
  // Fill out the form
  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

  // Click the Confirm button
  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  // Wait for the alert message
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('User created successfully!');
  });

  // Restore the original window.alert implementation
  mockAlert.mockRestore();
});

test('submits the form in DropdownLogIn component', async () => {
  // Mock window.alert
  const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

  // Mock fetch for users
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, email: 'test@example.com', password: 'password123' }])
    });
  });

  render(<App />);

  // Click the Log In button to open the dropdown
  const logInButton = screen.getByText(/Log In/i);
  fireEvent.click(logInButton);

  // Ensure the form fields are rendered
  const emailInput = await screen.findByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText('Password');

  // Fill out the form
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Click the Confirm button
  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  // Wait for the alert message
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Logged in successfully!');
  });

  // Restore the original window.alert implementation
  mockAlert.mockRestore();
});

test('submits the form in DropdownCreateEvent component', async () => {
  // Mock window.alert
  const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

  // Mock fetch for users
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }])
    });
  });

  render(<App />);

  // Click the Create Event button to open the dropdown
  const createEventButton = screen.getByText(/Create Event/i);
  fireEvent.click(createEventButton);

  // Ensure the form fields are rendered
  const titleInput = await screen.findByPlaceholderText(/Title/i);
  const descriptionInput = screen.getByPlaceholderText('Description');
  const startDateInput = screen.getByPlaceholderText('Start Date');
  const startTimeInput = screen.getByPlaceholderText('Start Time');
  const endDateInput = screen.getByPlaceholderText('End Date');
  const endTimeInput = screen.getByPlaceholderText('End Time');
  const locationInput = screen.getByPlaceholderText('Location');

  // Fill out the form
  fireEvent.change(titleInput, { target: { value: 'Test Event' } });
  fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
  fireEvent.change(startDateInput, { target: { value: '2024-05-23' } });
  fireEvent.change(startTimeInput, { target: { value: '12:00' } });
  fireEvent.change(endDateInput, { target: { value: '2024-05-24' } });
  fireEvent.change(endTimeInput, { target: { value: '12:00' } });
  fireEvent.change(locationInput, { target: { value: 'Test Location' } });

  // Select some users
  const user1Checkbox = screen.getByLabelText('user1');
  const user2Checkbox = screen.getByLabelText('user2');
  fireEvent.click(user1Checkbox);
  fireEvent.click(user2Checkbox);

  // Click the Confirm button
  const confirmButton = screen.getByText('Confirm');
  fireEvent.click(confirmButton);

  // Wait for the alert message
  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith('Event created and invites sent successfully!');
  });

  // Restore the original window.alert implementation
  mockAlert.mockRestore();
});




