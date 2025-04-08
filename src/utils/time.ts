import dayjs from 'dayjs';
import instance from './request';

type TimeAPIResponse = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  milliSeconds: number;
  dateTime: string;
  date: string;
  time: string;
  timeZone: string;
  dayOfWeek: string;
  dstActive: boolean;
};

class HSTime {
  static async getTimeAPI(): Promise<TimeAPIResponse> {
    return instance.get('https://www.timeapi.io/api/time/current/zone?timeZone=Asia%2FShanghai');
  }

  static async getDayjs() {
    const { dateTime } = await HSTime.getTimeAPI();
    return dayjs(dateTime);
  }

  static timestamp() {
    return dayjs().unix() * 1000;
  }
}

export default HSTime;
