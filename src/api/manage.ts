import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소

export const getDashboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/manage/dashboard`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
      return { 
        users_count: 0, 
        places_count: 0, 
        categories_count: 0,
        sns_accounts_count: 0 
      };
    }
  };

export const getSnsAccounts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/sns-accounts`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('SNS 계정 목록 조회 실패:', error);
    return { insta_nicknames: [], total_count: 0 };
  }
};

export const getSnsAccountsStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/sns-accounts/stats`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('SNS 계정 통계 조회 실패:', error);
    return { total_accounts: 0, account_stats: [] };
  }
};

export const getUsersList = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/users`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    return [];
  }
};

export const getPlacesPopularity = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/places/popularity`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('장소 인기도 조회 실패:', error);
    return { popular_places: [], total_places: 0 };
  }
};

export const getPlacesCategoryStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/places/category-stats`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('카테고리별 장소 통계 조회 실패:', error);
    return { category_stats: [], total_categories: 0 };
  }
};