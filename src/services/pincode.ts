import qs from 'qs';
import HttpService from '.';



export default class PincodeService {
  static getPincode() {
    return HttpService.get<number>(`/pincode/getPincode`);
  }

  static updatePincode(newPincode: object) {
    return HttpService.patch<number>(`/pincode/updatePincode`, newPincode);
  }

}