export const insertPlayerByScore = (users, newPlayer) => {
  // Find score lower than actual score
  const index = users.findIndex((user) => user.max_score < newPlayer.max_score);

  // If is -1, push it to the last place
  if (index === -1) {
    users.push(newPlayer);
  } else {
    users.splice(index, 0, newPlayer);
  }

  return users;
};
