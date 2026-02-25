export const USER_RESULT = {
  id: "testing-arena",
  username: "testing-arena",
  class: "User"
};

export const USER_CONTENTS_RESULT = {
  data: [
    {
      id: 333,
      title: "user content block",
      class: "Text"
    }
  ],
  meta: {
    current_page: 1,
    per_page: 24,
    total_pages: 1,
    total_count: 1,
    next_page: null,
    prev_page: null,
    has_more_pages: false
  }
};

export const USER_FOLLOWERS_RESULT = {
  data: [
    {
      id: "follower-1",
      username: "follower-1",
      class: "User"
    }
  ],
  meta: {
    current_page: 1,
    per_page: 24,
    total_pages: 1,
    total_count: 1,
    next_page: null,
    prev_page: null,
    has_more_pages: false
  }
};

export const USER_FOLLOWING_RESULT = {
  data: [
    {
      id: "followed-channel",
      title: "followed channel",
      class: "Channel"
    }
  ],
  meta: {
    current_page: 1,
    per_page: 24,
    total_pages: 1,
    total_count: 1,
    next_page: null,
    prev_page: null,
    has_more_pages: false
  }
};
