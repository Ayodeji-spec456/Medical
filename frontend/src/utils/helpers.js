export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatCurrency = (amount) => {
  return `$${(amount / 100).toFixed(2)}`;
};

export const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^\+?[\d\s-()]+$/;
  return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: '#ffc107',
    confirmed: '#0dcaf0',
    completed: '#0d6efd',
    cancelled: '#dc3545',
    paid: '#0dcaf0',
    refunded: '#6c757d'
  };
  return colors[status] || '#6c757d';
};

export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const isTimeSlotAvailable = (date, time, bookedSlots) => {
  const dateStr = new Date(date).toISOString().split('T')[0];
  return !bookedSlots.some(
    slot => slot.date === dateStr && slot.time === time
  );
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};