export interface Booking {
  statusText: string;
  billNo:string,
  id: number,
  uniqueId: string,
  customerId: number,
  shipperId: number,
  consigneeId: number,
  salesexecutiveId: number,
  incotermId: number,
  shipmentmodeId: number,
  agentId: number,
  customerPo: string,
  carrier: string,
  cargoloads: Array<Partial<cargoLoads>>,
  routing: {
    origin: Partial<Origin>
    destination: Partial<Destination>
  },
  cargoExtrainfo: cargoExtrainfo,
  cargofiles: Array<string>
  cargoFilesSources:Array<any>
  status?:number
}

export interface cargoExtrainfo {

  eta: string,
  etd: string,
  vessel: string,
  voyage: string,
  containerNumber: string,
  hblNumber:string,
  flightNumber:string,
  coLoader:string,
  mblNumber: string,
  awbNumber: string,
  insurance: number,
  quoteNumber: number,
  freightJobNumber: string,
  internalNote:string,
  externalNote:string,
  freehand:number|boolean

}
export interface Origin {
  
    pickupDate: string,
    readyDate:string,
    location: string,
    pincode: number,
    address: string,
    locationtypeId: number,
    airportId: number,
    seaportId: number

}

export interface Destination {
  location: string,
  pincode: number,
  address: string,
  locationtypeId: number,
  airportId: number,
  seaportId: number
}
export interface cargoLoads {

  cargoDescription: string,
  containertypeId: number,
  packagetypeId: number,
  containerCount: number,
  weightUnit: number,
  weight: number,
  overWeight: number,
  quantity: number,
  perPackageWeight: number,
  totalWeight: number,
  lengthUnit: number,
  length: number,
  height: number,
  width: number,
  cbm: number,
  totalCbm: number,
  additionalInformation:string,
  cargoType:string,
  chargeableWeight: number
  containerNumber: string,
}

