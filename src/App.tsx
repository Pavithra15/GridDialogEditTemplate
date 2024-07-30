import { createRoot } from 'react-dom/client';
import * as React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
} from '@syncfusion/ej2-react-grids';
import {
  Grid,
  Edit,
  Toolbar,
  Page,
  EditSettingsModel,
  ToolbarItems,
  DialogEditEventArgs,
} from '@syncfusion/ej2-grids';

import { data as orderData } from './datasource';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DataUtil } from '@syncfusion/ej2-data';
import { Browser, extend, isNullOrUndefined } from '@syncfusion/ej2-base';

export const App = () => {
  const toolbarOptions: ToolbarItems[] = ['Add', 'Edit', 'Delete'];
  const editSettings: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
    template: dialogTemplate,
  };
  const validationRules = { required: true };
  const orderidRules: Object = { required: true, number: true };

  function dialogTemplate(props: IOrderModel): any {
    return <DialogFormTemplate {...props} />;
  }

  function actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      if (Browser.isDevice) {
        args.dialog.height = window.innerHeight - 90 + 'px';
        (args.dialog as any).dataBind();
      }
    }
  }
  return (
    <GridComponent
      dataSource={orderData}
      toolbar={toolbarOptions}
      allowSorting={true}
      allowFiltering={true}
      allowPaging={true}
      editSettings={editSettings}
      actionComplete={actionComplete.bind(this)}
    >
      <ColumnsDirective>
        <ColumnDirective
          field="OrderID"
          headerText="Order ID"
          width="120"
          textAlign="Right"
          validationRules={orderidRules}
          isPrimaryKey={true}
        ></ColumnDirective>
        <ColumnDirective
          field="CustomerID"
          headerText="Customer Name"
          width="150"
          validationRules={validationRules}
        ></ColumnDirective>
        <ColumnDirective
          field="Freight"
          headerText="Freight"
          width="120"
          format="C2"
          textAlign="Right"
        ></ColumnDirective>
        <ColumnDirective
          field="OrderDate"
          headerText="Order Date"
          format="yMd"
          width="170"
        ></ColumnDirective>
        <ColumnDirective
          field="ShipCountry"
          headerText="Ship Country"
          width="150"
        ></ColumnDirective>
      </ColumnsDirective>
      <Inject services={[Page, Toolbar, Edit]} />
    </GridComponent>
  );
};
function DialogFormTemplate(props) {
  const shipCityDistinctData: any = DataUtil.distinct(
    orderData,
    'ShipCity',
    true
  );
  const shipCountryDistinctData: any = DataUtil.distinct(
    orderData,
    'ShipCountry',
    true
  );
  let orderID: HTMLInputElement;
  let CustomerID: HTMLInputElement;
  const [val, setval] = React.useState(extend({}, {}, props, true));
  function onChange(args: any): void {
    let key: string = args.target.name;
    let value: string = args.target.value;
    setval((prevVal) => ({ ...prevVal, [key]: value }));
  }
  let data: IOrderModel = val;
  // react warning error purpose
  if (data.isAdd) {
    let keys: string[] = Object.keys(data);
    for (let i: number = 0; i < keys.length; i++) {
      if (data[keys[i]] !== 'isAdd' && isNullOrUndefined(data[keys[i]])) {
        data[keys[i]] = '';
      }
    }
  }
  return (
    <div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <div className="e-float-input e-control-wrapper">
            <input
              ref={(input) => (orderID = input)}
              id="OrderID"
              name="OrderID"
              type="text"
              disabled={!data.isAdd}
              value={data.OrderID}
              onChange={onChange.bind(this)}
            />
            <span className="e-float-line"></span>
            <label className="e-float-text e-label-top"> Order ID</label>
          </div>
        </div>
        <div className="form-group col-md-6">
          <div className="e-float-input e-control-wrapper">
            <input
              ref={(input) => (CustomerID = input)}
              value={data.CustomerID}
              id="CustomerID"
              name="CustomerID"
              type="text"
              onChange={onChange.bind(this)}
            />
            <span className="e-float-line"></span>
            <label className="e-float-text e-label-top">Customer ID</label>
          </div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <NumericTextBoxComponent
            id="Freight"
            format="C2"
            value={data.Freight}
            placeholder="Freight"
            floatLabelType="Always"
          ></NumericTextBoxComponent>
        </div>
        <div className="form-group col-md-6">
          <DatePickerComponent
            id="OrderDate"
            value={data.OrderDate}
            placeholder="Order Date"
            floatLabelType="Always"
          ></DatePickerComponent>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <DropDownListComponent
            id="ShipCountry"
            value={data.ShipCountry}
            dataSource={shipCountryDistinctData}
            fields={{ text: 'ShipCountry', value: 'ShipCountry' }}
            placeholder="Ship Country"
            popupHeight="300px"
            floatLabelType="Always"
          ></DropDownListComponent>
        </div>
        <div className="form-group col-md-6">
          <DropDownListComponent
            id="ShipCity"
            value={data.ShipCity}
            dataSource={shipCityDistinctData}
            fields={{ text: 'ShipCity', value: 'ShipCity' }}
            placeholder="Ship City"
            popupHeight="300px"
            floatLabelType="Always"
          ></DropDownListComponent>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
          <div className="e-float-input e-control-wrapper">
            <textarea
              id="ShipAddress"
              name="ShipAddress"
              value={data.ShipAddress}
              onChange={onChange.bind(this)}
            ></textarea>
            <span className="e-float-line"></span>
            <label className="e-float-text e-label-top">Ship Address</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface IOrderModel {
  OrderID?: number;
  CustomerID?: string;
  Freight?: number;
  OrderDate?: Date;
  ShipCity?: string;
  ShipCountry?: string;
  ShipAddress?: string;
  isAdd?: boolean;
}
