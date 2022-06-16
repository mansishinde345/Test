import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { NavigationMixin } from 'lightning/navigation';
import getOrderProductRecords from '@salesforce/apex/PPB_OrderAmendmentWizardController.getOrderProductRecords';
import CheckTheOrderProduct from '@salesforce/apex/PPB_OrderAmendmentWizardController.HandleCheckBoxValue';
import TerminateOrderProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.TerminateOrderProducts';
import OnHoldOrderProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.OnHoldOrderProducts';
import SwapOrderProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.SwapOrderProducts';
import FrequencyChangeOrderProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.FrequencyChangeOrderProducts';
import createDiscountScheduleList from '@salesforce/apex/PPB_OrderAmendmentWizardController.createDiscountScheduleList';
import createBlockPriceList from '@salesforce/apex/PPB_OrderAmendmentWizardController.createBlockPriceList';
import PriceChangeProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.PriceChangeProducts';
import AddOrderProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.AddOrderProducts';
import CheckInvoices from '@salesforce/apex/PPB_OrderAmendmentWizardController.CheckInvoices';
import getPickListValuesIntoList from '@salesforce/apex/PPB_OrderAmendmentWizardController.getPickListValuesIntoList';
import createBusinessUnitList from '@salesforce/apex/PPB_OrderAmendmentWizardController.createBusinessUnitList';
import getPickListValuesIntoListFreq from '@salesforce/apex/PPB_OrderAmendmentWizardController.getPickListValuesIntoListFreq';
import getPickListValuesIntoListType from '@salesforce/apex/PPB_OrderAmendmentWizardController.getPickListValuesIntoListType';
import getPickListValuesIntoListFixedMonth from '@salesforce/apex/PPB_OrderAmendmentWizardController.getPickListValuesIntoListFixedMonth';
import getPickListValuesIntoListUsage from '@salesforce/apex/PPB_OrderAmendmentWizardController.getPickListValuesIntoListUsage';
import getOPBPFrequencyvalues from '@salesforce/apex/PPB_OrderAmendmentWizardController.getOPBPFrequencyvalues';
import CheckOrderProducts from '@salesforce/apex/PPB_OrderAmendmentWizardController.CheckOrderProducts';
import getProductOptions from '@salesforce/apex/PPB_OrderAmendmentWizardController.getProductOptions';
import getProduct from '@salesforce/apex/PPB_OrderAmendmentWizardController.getProduct';
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';
import id from '@salesforce/user/Id';




export default class Ppb_OrderAmendmentWizard extends NavigationMixin(LightningElement) {

    @api recordId;
    @track oliSelection = [];
    @track newOrderSubscriptionTerm;
    @track PresentAmendmentQuotetoCustomer=false;
    @track newOrderBuisnessUnitOptions=[];
    @track newOrderBuisnessUnitOptions;
    @track newOrderBuisnessUnitId=null;
    saveDraftValues = [];
    saveDraftValues2 = [];
    @track displayOne = true;
    @track terminationdateEntered=true;
    @track displaySec = false;
    @track displayFour = false;
    @track displayThree = false;
    @track UpdateStartEndDate = false;
    @track OnHold = false;
    @track ProductSwap = false;
    @track FrequencyChange = false;
    @track AddProducts = false;
    @track ProductSwapPage1 = false;
    @track ProductSwapPage2 = false;
    @track PriceChange = false;
    @track ExpandedRows = [];
    @track Product=null;
    @track gridData;
    @track allRows;
    @track casesSpinner = false;
    @track isHasMoreQli = true;
    @track currentSelectedRows = [];  // used to track changes
    @track quoteLineListObj;
    @track selectedRows = [];
    @track oliList;
    @track toggleselectedrecords = [];
    @track toggleselectedrows = [];
    @track togglecurrentselectedrows = [];
    @track toggled = false;
    @track isOrder = false;
    @api objectApiName;
    @track selectedStep = 'Step1';
    @track Billingoptions;
    @track BillingFreqOptions=[];
    @track BillingTypeOption=[];
    @track FixedBilledMonthOption=[];
    @track UsageTypeOption=[];
    @track OPBPFreqoptions=[];
    @track OPBPFreqoptions;
    @track BillingFreqOptions;
    @track BillingTypeOption;
    @track FixedBilledMonthOption;
    @track UsageTypeOption; 
    checkStatus;

    @track lstOptions = [
        { label : 'Cricket', value : 'Cricket'},
        { label : 'Football', value : 'Football'}
    ];

    @track ProductOptions=[];




    @track gridColumns = [
        {
            type: 'text',
            fieldName: 'productName',
            label: 'Product Name'
        },
        {
            type: 'text',
            fieldName: 'BusinessUnitName',
            label: 'Buisness Name'
        },
        {
            type: 'date-local',
            fieldName: 'StartDate',
            label: 'Start Date'
        },
         {
            type: 'date-local',
            fieldName: 'LastBillingDate',
            label: 'Last Billing Date'
         },
         {
             type: 'date-local',
             fieldName: 'NextBillingDate',
             label: 'Next Billing Date'
         },
        {
            type: 'number',
            fieldName: 'quantity',
            typeAttributes: { maximumFractionDigits: 2 },
            label: 'Quantity'
        },
        {
            type: 'currency',
            fieldName: 'price',
            typeAttributes: { maximumFractionDigits: 2 },
            label: 'Price'
        }];

    @track gridColumnsProductSwap = [
        {
            fieldName: '',
            cellAttributes: { iconName: { fieldName: 'ProductSwapicon' } },
            label: 'Product Swap'
        },
        {
            type: 'text',
            fieldName: 'productName',
            label: 'Product Name'
        },
        {
            type: 'text',
            fieldName: 'BusinessUnitName',
            label: 'Buisness Name'
        },
        {
            type: 'date-local',
            fieldName: 'StartDate',
            label: 'Start Date'
        },
        // {
        //     type: 'date-local',
        //     fieldName: 'LastBillingDate',
        //     label: 'Last Billing Date'
        // },
        // {
        //     type: 'date-local',
        //     fieldName: 'NextBillingDate',
        //     label: 'Next Billing Date'
        // },
        {
            type: 'number',
            fieldName: 'quantity',
            typeAttributes: { maximumFractionDigits: 2 },
            label: 'Quantity'
        },
        {
            type: 'currency',
            fieldName: 'price',
            typeAttributes: { maximumFractionDigits: 2 },
            label: 'Price'
        }];

        @track gridColumnsFrequency = [
            {
                fieldName: '',
                cellAttributes: { iconName: { fieldName: 'FrequencyChangeicon' } },
                label: 'Frequency Change'
            },
            {
                type: 'text',
                fieldName: 'productName',
                label: 'Product Name'
            },
            {
                type: 'text',
                fieldName: 'BusinessUnitName',
                label: 'Buisness Name'
            },
            {
                type: 'date-local',
                fieldName: 'StartDate',
                label: 'Start Date'
            },
             {
                 type: 'date-local',
                fieldName: 'LastBillingDate',
                 label: 'Last Billing Date'
             },
             {
                type: 'date-local',
                 fieldName: 'NextBillingDate',
                label: 'Next Billing Date'
             },
            {
                type: 'number',
                fieldName: 'quantity',
                typeAttributes: { maximumFractionDigits: 2 },
                label: 'Quantity'
            },
            {
                type: 'currency',
                fieldName: 'price',
                typeAttributes: { maximumFractionDigits: 2 },
                label: 'Price'
            }];   

            @track gridColumnsPrice = [
                {
                    fieldName: '',
                    cellAttributes: { iconName: { fieldName: 'PriceChangeIcon' } },
                    label: 'Price Change'
                },
                {
                    type: 'text',
                    fieldName: 'productName',
                    label: 'Product Name'
                },
                {
                    type: 'text',
                    fieldName: 'BusinessUnitName',
                    label: 'Buisness Name'
                },
                {
                    type: 'date-local',
                    fieldName: 'StartDate',
                    label: 'Start Date'
                },
                 {
                     type: 'date-local',
                     fieldName: 'LastBillingDate',
                     label: 'Last Billing Date'
             },
                 {
                     type: 'date-local',
                     fieldName: 'NextBillingDate',
                     label: 'Next Billing Date'
                 },
                {
                    type: 'number',
                    fieldName: 'quantity',
                    typeAttributes: { maximumFractionDigits: 2 },
                    label: 'Quantity'
                },
                {
                    type: 'currency',
                    fieldName: 'price',
                    typeAttributes: { maximumFractionDigits: 2 },
                    label: 'Price'
                }];       

    @track olicolumnsOnHold = [
        {
            type: 'text',
            fieldName: 'productName',
            label: 'Product Name'
        },
        {
            type: 'text',
            fieldName: 'BusinessUnitName',
            label: 'Buisness Name'
        },
        {
            type: 'date-local',
            fieldName: 'StartDate',
            label: 'Start Date'
        },
     {
             type: 'date-local',
             label: 'Last Billing Date'
        },
        {
            type: 'number',
            fieldName: 'quantity',
            typeAttributes: { maximumFractionDigits: 2 },
            cellAttributes: { alignment: 'left' },
            label: 'Quantity'
        },
        {
            type: 'currency',
            fieldName: 'price',
            typeAttributes: { maximumFractionDigits: 2 },
            cellAttributes: { alignment: 'left' },
            label: 'Price'
        },
     {
             type: 'date-local',
          fieldName: 'NextBillingDate',
            label: 'Next Billing Date'
        },
        {
            type: 'date-local',
            fieldName: 'HoldDate',
            label: 'On Hold Date',
            editable: "true",
            hideDefaultActions: "true"
        }];

    @track olicolumnsTerminated = [
        {
            type: 'text',
            fieldName: 'productName',
            label: 'Product Name'
        },
        {
            type: 'text',
            fieldName: 'BusinessUnitName',
            label: 'Buisness Name'
        },
         {
             type: 'date-local',
            fieldName: 'LastBillingDate',
             label: 'Last Billing Date'
         },
        {
            type: 'number',
            fieldName: 'quantity',
            typeAttributes: { maximumFractionDigits: 2 },
            cellAttributes: { alignment: 'left' },
            label: 'Quantity'
        },
        {
            type: 'currency',
            fieldName: 'price',
            typeAttributes: { maximumFractionDigits: 2 },
            cellAttributes: { alignment: 'left' },
            label: 'Price'
        },
         {
             type: 'date-local',
             fieldName: 'NextBillingDate',
             label: 'Next Billing Date'
        },
        {
            type: 'date-local',
            fieldName: 'StartDate',            
            label: 'Start Date',
            editable: "true",
            hideDefaultActions: "true"
        },
        {
            type: 'date-local',
            fieldName: 'TerminatedDate',
            label: 'Termination Date',
            editable: "true",
            hideDefaultActions: "true"
        }];


    Amendment = '';

    connectedCallback(){ 
        this.doInit();
     }

    get options() {
        return [
            { label: 'Product Swap', value: 'Product Swap' },
            { label: 'Update Start or End Date', value: 'Update Start or End Date' },
            { label: 'Addition', value: 'Addition' },
            { label: 'Frequency Change', value: 'Frequency Change' },
            { label: 'Price Change', value: 'Price Change' },
            { label: 'Billing Hold', value: 'Billing Hold' }
        ];
    }

    handleOnChange(evt) {
        console.log('In handle change' + evt.target.value);
        this.Amendment = evt.target.value;
    }

    @track Invoices;

    doInit(){
       
        var OrderId=this.recordId;
        console.log('OrderId'+OrderId);
        CheckInvoices({ oId: OrderId })
        .then(r => {
            console.log('r'+r)
            this.Invoices=r;
            getPickListValuesIntoList({})
            .then(r => {
                if(r!=null){
                    var picklist = [];
                    r.forEach(function (recordvalue) {
                        picklist.push({ label: recordvalue, value: recordvalue });
                    })    
                    this.Billingoptions=picklist;
                }
            })

        })

        createBusinessUnitList({OrderId:OrderId})
        .then(r => {
            if(r!=null){
                this.newOrderBuisnessUnitOptions=r;
            }
            
        })

        getPickListValuesIntoListFreq({OrderId:OrderId})
        .then(r => {
            if(r!=null){
                var picklist = [];
                    r.forEach(function (recordvalue) {
                        picklist.push({ label: recordvalue, value: recordvalue });
                    })    
                   // this.Billingoptions=picklist;
                this.BillingFreqOptions=picklist;
            }
        })

        getPickListValuesIntoListType({OrderId:OrderId})
        .then(r => {
            if(r!=null){
                var picklist = [];
                    r.forEach(function (recordvalue) {
                        picklist.push({ label: recordvalue, value: recordvalue });
                    })    
                   // this.Billingoptions=picklist;
                this.BillingTypeOption=picklist;
            }
        })

        getPickListValuesIntoListFixedMonth({OrderId:OrderId})
        .then(r => {
            if(r!=null){
                var picklist = [];
                    r.forEach(function (recordvalue) {
                        picklist.push({ label: recordvalue, value: recordvalue });
                    })    
                   // this.Billingoptions=picklist;
                this.FixedBilledMonthOption=picklist;
            }
        })

        getPickListValuesIntoListUsage({OrderId:OrderId})
        .then(r => {
            if(r!=null){
                var picklist = [];
                    r.forEach(function (recordvalue) {
                        picklist.push({ label: recordvalue, value: recordvalue });
                    })    
                   // this.Billingoptions=picklist;
                this.UsageTypeOption=picklist;
            }
        })

        getOPBPFrequencyvalues({OrderId:OrderId})
        .then(r => {
            if(r!=null){
                var picklist = [];
                    r.forEach(function (recordvalue) {
                        picklist.push({ label: recordvalue, value: recordvalue });
                    })    
                   // this.Billingoptions=picklist;
                this.OPBPFreqoptions=picklist;
            }
        })
    
    }

  
    

    @wire(getOrderProductRecords, { oId: '$recordId' })
    accountTreeData({ error, data }) {
        var dataObj;
        console.log('data***' + data);
        if (data) {
            this.casesSpinner = true;
            console.log(data);
            let strData = JSON.stringify(data);
            //strData = strData.replace('children','_children');
            strData = strData.replace(/children/g, '_children');
            console.log(strData);
            dataObj = JSON.parse(strData);
            console.log(dataObj);
            let rows = [];
            var optionss = [];
            dataObj.forEach(function (record) {
                if (record._children) {
                    rows.push(record.Id);
                    optionss = record.BillingFrequencyPicklistValues;
                    record._children.forEach(function (child) {
                        if (child._children) {
                            rows.push(child.Id);
                        }
                    })
                }
            })
            var picklist = [];
            optionss.forEach(function (recordvalue) {
                picklist.push({ label: recordvalue, value: recordvalue });
            })
            //this.Billingoptions = picklist;
            console.log('rows' + rows);
            this.ExpandedRows = rows;
            this.quoteLineListObj = dataObj;
            /*let tempData = JSON.parse(JSON.stringify(data));
    
            for (let i = 0; i < tempData.length; i++) {
    
                let cons = tempData[i].qliProdList;
    
                if (cons) {
    
                    tempData[i]._children = cons;
                    delete tempData[i].contList;
    
                }
    
            }*/
            this.gridData = dataObj;
            this.allRows = dataObj;

            //console.log(tempData);
            //   this.setSelectedRows(gridData);
            this.casesSpinner = false;
        } else if (error) {

            if (Array.isArray(error.body)) {
                //  console.log('Error is ',error.body.map( e => e.message ).join( ', ' ) );    
            } else if (typeof error.body.message === 'string') {
                //  console.log( 'Error is ' + error.body.message );
            }
        }
    }

    SaveClose() {
        console.log('In SaveClose');
        console.log('OLILIST'+JSON.stringify(this.oliList));
        if (this.Amendment != null || this.Amendment != '') {
            var terminateerror = false;
            var OnHolderror = false;
            var ProductSwaperror = false;
            var ProductSwaperror2 = false;
            var ProductSwaperror3 = false;
            var PriceChangeerror = false;            
            if ((this.oliList == "" || this.oliList == undefined || this.oliList == null)){
                const evt = new ShowToastEvent({
                    title: "Error",
                    message: "No Order Products are selected. Please select the Order Product",
                    variant: "error",
                    mode: "dismissable"
                    });
                    this.dispatchEvent(evt);
                    
            }else{
            this.oliList.forEach(function (record) {
                if ((record.NextBillingDate != null && record.TerminatedDate < record.NextBillingDate && record.TerminatedDate!=null) || (record.LastBillingDate != null && record.TerminatedDate < record.LastBillingDate && record.TerminatedDate!=null) || (record.StartDate != null && record.TerminatedDate < record.StartDate && record.TerminatedDate!=null)) {
                    terminateerror = true;
                }
                if ((record.NextBillingDate != null && record.HoldDate < record.NextBillingDate) || (record.LastBillingDate != null && record.HoldDate < record.LastBillingDate) || (record.StartDate != null && record.HoldDate < record.StartDate) || record.HoldDate==null) {
                    OnHolderror = true;
                }
                if (((record.NextBillingDate != null && record.ReplacementDate < record.NextBillingDate) || (record.LastBillingDate!=null && record.ReplacementDate < record.LastBillingDate) || (record.StartDate != null && record.ReplacementDate < record.StartDate) || record.ReplacementDate==null) && record.isParent==true) {
                    if(record.ReplacementDate < record.StartDate){
                        console.log('In Product swap errorr'+record.StartDate);
                        console.log('In Product swap errorr'+record.ReplacementDate);
                    }
                    ProductSwaperror = true;
                }
                if ((record.NextBillingDate != null && record.EffectiveDate < record.NextBillingDate) || (record.LastBillingDate != null && record.EffectiveDate < record.LastBillingDate) || (record.StartDate != null && record.EffectiveDate < record.StartDate) || record.EffectiveDate==null) {
                    PriceChangeerror = true;
                }
                if((record.isParent==true || record.SelectedAlone==true) && (record.BuisnessUnitId==null || record.BuisnessUnitId=="")){
                    ProductSwaperror2=true;
                }
                if((record.isParent==true || record.SelectedAlone==true) && (record.NewProduct==null || record.NewProduct=="")){
                    ProductSwaperror3=true;
                }
              
              
            })
            if (this.PriceChange == true) {
                if (PriceChangeerror == false) {
                    this.PriceChangeProducts();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record Effective Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            } else if (this.UpdateStartEndDate == true) {
                console.log('In terminateOrderProducts true');
                if (terminateerror == false) {
                    this.terminateOrderProducts();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record Termination Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            } else if (this.OnHold == true) {
                if (OnHolderror == false) {
                    this.OnHoldOrderProducts();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record OnHold Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            } else if (this.ProductSwap == true) {
                if (ProductSwaperror == false && ProductSwaperror2==false && ProductSwaperror3==false) {
                    this.SwapOrderProducts();
                } else {
                    if(ProductSwaperror2==true){
                        const event = new ShowToastEvent({
                            title: 'Error',
                            message: 'Order Product New Buisness Unit is required',
                            variant: 'error',
                            mode: 'sticky'
                        });
                        this.dispatchEvent(event);
                    }else if(ProductSwaperror3==true){
                        const event = new ShowToastEvent({
                            title: 'Error',
                            message: 'Replacment product is required',
                            variant: 'error',
                            mode: 'sticky'
                        });
                        this.dispatchEvent(event);
                    }else{
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record Replacement Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
                }
                
                    
              
            } else if (this.FrequencyChange == true) {
                this.FrequencyChangeOrderProducts();
            }
        }
    }
    }


    SaveCloseNew() {
        console.log('In SaveClose new');
        if (this.Amendment != null || this.Amendment != '') {
            var terminateerror = false;
            var OnHolderror = false;
            var ProductSwaperror = false;
            var PriceChangeerror = false;
            var ProductSwaperror2=false;
            var ProductSwaperror3=false;
            this.oliList.forEach(function (record) {
                if ((record.NextBillingDate != null && record.TerminatedDate < record.NextBillingDate && record.TerminatedDate!=null) || (record.LastBillingDate != null && record.TerminatedDate < record.LastBillingDate && record.TerminatedDate!=null) || (record.StartDate != null && record.TerminatedDate < record.StartDate && record.TerminatedDate!=null)) {
                    terminateerror = true;
                }
                if ((record.NextBillingDate != null && record.HoldDate < record.NextBillingDate) || (record.LastBillingDate != null && record.HoldDate < record.LastBillingDate) || (record.StartDate != null && record.HoldDate < record.StartDate) || record.HoldDate==null) {
                    OnHolderror = true;
                }
                if (((record.NextBillingDate != null && record.ReplacementDate < record.NextBillingDate) || (record.LastBillingDate != null && record.ReplacementDate < record.LastBillingDate) || (record.StartDate != null && record.ReplacementDate < record.StartDate) || record.ReplacementDate==null) && record.isParent==true) {
                    console.log('In Product Error');
                    ProductSwaperror = true;
                }
                if ((record.NextBillingDate != null && record.EffectiveDate < record.NextBillingDate) || (record.LastBillingDate != null && record.EffectiveDate < record.LastBillingDate) || (record.StartDate != null && record.EffectiveDate < record.StartDate) || record.EffectiveDate==null) {
                    PriceChangeerror = true;
                }
                if(record.NewProduct==null||record.NewProduct==""){
                    ProductSwaperror2=true;
                }
                if(record.productId==null||record.productId==""){
                    ProductSwaperror3=true;
                }
                
            })
            console.log('terminateerror' + terminateerror);
            if (this.PriceChange == true) {
                if (PriceChangeerror == false) {
                    this.PriceChangeProductsNew();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record Effective Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            }
            if (this.UpdateStartEndDate == true) {
                console.log('In terminateOrderProducts true');
                if (terminateerror == false) {
                    this.terminateOrderProductsNew();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record Termination Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            } else if (this.OnHold == true) {
                if (OnHolderror == false) {
                    this.OnHoldOrderProductsNew();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record OnHold Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            } else if (this.ProductSwap == true) {
                if (ProductSwaperror == false) {
                    this.SwapOrderProductsNew();
                } else {
                    if(ProductSwaperror2==true){
                        const event = new ShowToastEvent({
                            title: 'Error',
                            message: 'Order Product New Buisness Unit is required',
                            variant: 'error',
                            mode: 'sticky'
                        });
                        this.dispatchEvent(event);
                    }else if(ProductSwaperror3==true){
                        const event = new ShowToastEvent({
                            title: 'Error',
                            message: 'Replacement productss is required',
                            variant: 'error',
                            mode: 'sticky'
                        });
                        this.dispatchEvent(event);
                    }
                    else{
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product record Replacement Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
                }
            } else if (this.FrequencyChange == true) {
                this.FrequencyChangeOrderProductsNew();
            }
        }
    }

    FrequencyChangeOrderProducts() {
        this.casesSpinner = true;
        console.log('In terminate products');
        FrequencyChangeOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == 'true') {
                    console.log('In r' + r);
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Order Product Frequency Changed',
                        message: 'Order Product record Frequency changed Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.open = false;
                    const closeQA = new CustomEvent('close');
                    // Dispatches the event.
                    this.dispatchEvent(closeQA);
                    window.location.reload();
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: r,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    FrequencyChangeOrderProductsNew() {
        this.casesSpinner = true;
        console.log('In terminate products');
        console.log('this.oliList'+this.oliList);
        TerminateOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == 'true') {
                    this.casesSpinner = false;
                    console.log('In r' + r);
                    const event = new ShowToastEvent({
                        title: 'Order Product Frequency Changed',
                        message: 'Order Product records Frequency changed Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.displayOne = true;
                    this.displaySec = false;
                    this.displayThird = false;
                    this.selectedStep = 'Step1';
                    this.Amendment = '';
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: r,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    terminateOrderProducts() {
        this.casesSpinner = true;
        console.log('In terminate products');
        console.log('this.oliList 803'+this.oliList);
        TerminateOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == 'true') {
                    console.log('In r' + r);
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Order Product Terminated',
                        message: 'Order Product records terminated Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.open = false;
                    const closeQA = new CustomEvent('close');
                    // Dispatches the event.
                    this.dispatchEvent(closeQA);
                    window.location.reload();
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: r,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    terminateOrderProductsNew() {
        this.casesSpinner = true;
        console.log('In terminate products');
        console.log('this.oliList 807'+this.oliList);
        TerminateOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == true) {
                    this.casesSpinner = false;
                    console.log('In r' + r);
                    const event = new ShowToastEvent({
                        title: 'Order Product Terminated',
                        message: 'Order Product records terminated Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.displayOne = true;
                    this.displaySec = false;
                    this.displayThird = false;
                    this.selectedStep = 'Step1';
                    this.Amendment = '';
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product records were not terminated Sucessfully',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    PriceChangeProducts() {
        this.casesSpinner = true;
        console.log('In terminate products');
        PriceChangeProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r =='true') {
                    console.log('In r' + r);
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Order Products Updated Successfully',
                        message: 'Order Product records Price Changed Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.open = false;
                    const closeQA = new CustomEvent('close');
                    // Dispatches the event.
                    this.dispatchEvent(closeQA);
                    window.location.reload();
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: r,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    PriceChangeProductsNew() {
        this.casesSpinner = true;
        console.log('In terminate products');
        PriceChangeProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == true) {
                    this.casesSpinner = false;
                    console.log('In r' + r);
                    const event = new ShowToastEvent({
                        title: 'Order Product Price Changed',
                        message: 'Order Product records Price Changed Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.displayOne = true;
                    this.displaySec = false;
                    this.displayThird = false;
                    this.selectedStep = 'Step1';
                    this.Amendment = '';
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product records Price not Changed Sucessfully',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    OnHoldOrderProducts() {
        this.casesSpinner = true;
        OnHoldOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == true) {

                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Order Product records were put on Hold Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.casesSpinner = false;
                    this.open = false;
                    const closeQA = new CustomEvent('close');
                    // Dispatches the event.
                    this.dispatchEvent(closeQA);
                    window.location.reload();
                } else {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product records were not put on Hold Sucessfully',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                    this.casesSpinner = false;
                }
            })
    }

    handleProductSelect(event) {
        this.casesSpinner = true;
            this.Product=event.detail.value;
            var ProdId=''+this.Product;
            console.log('this.Product'+this.Product);
            getProduct({ productId: ProdId })
            .then(r => {
                console.log('r'+r);
                if (r !=null) {
                    const startSelect = this.template.querySelector('.start-select');
                    if (startSelect) {
                        startSelect.value = r.SBQQ__BillingFrequency__c;
                        this.newOrderBillingFrequency= r.SBQQ__BillingFrequency__c;
                    }
                    const term = this.template.querySelector('.term');
                    if(term){
                        this.newOrderSubscriptionTerm=r.SBQQ__SubscriptionTerm__c;
                        term.value=r.SBQQ__SubscriptionTerm__c;
                    }
                    this.casesSpinner = false;
                }else{
                    this.casesSpinner = false;
                }
            })
    }

    handleChangeOfCheckbox(event) {
            this.PresentAmendmentQuotetoCustomer = event.target.checked;
}


    handleSubscriptionTerm(event){
        console.log('this.newOrderSubscriptionTerm'+event.detail.value);
        this.newOrderSubscriptionTerm=event.detail.value;
    }

    handleSubscriptionTermm(evt){
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.SubscriptionTerm = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleAddProducts(){
        if(this.checkStatus){
            this.CheckOrderProducts();
        }else{
        console.log('this.newOrderBuisnessUnitId'+this.newOrderBuisnessUnitId);
        if((this.Product!=null && this.Product!='') && (typeof this.newOrderBuisnessUnitId !==undefined && this.newOrderBuisnessUnitId != null && this.newOrderBuisnessUnitId!='')){
            this.casesSpinner = true;
            var ProdId=''+this.Product;
            console.log('this.recordId'+this.recordId);
            console.log('this.newOrderStartDate'+this.newOrderStartDate);
        AddOrderProducts({ ProductId: ProdId, OrderId:this.recordId,BillingFrequency:this.newOrderBillingFrequency,StartDate:this.newOrderStartDate,BuisnessUnit:this.newOrderBuisnessUnitId,SubscriptionTerm:this.newOrderSubscriptionTerm})
            .then(r => {
                console.log('this.recordId --> 1049'+r);
                if (r != '' && r != null && !r.startsWith('Error')) {
                    this.casesSpinner = false;
                    console.log('r' + r);
                    window.location.href = '/apex/sbqq__sb?scontrolCaching=1&id=' + r;
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Order Product Added sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.open = false;
                    // Dispatches the event.
                    //window.location.reload();

                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: r,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
        }else{
            if(this.Product==null || this.Product==''){
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'please Select a Product to add',
                    variant: 'error',
                    mode: 'sticky'
                });
                this.dispatchEvent(event);
            }else{
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'Please Select a Business Unit',
                    variant: 'error',
                    mode: 'sticky'
                });
                this.dispatchEvent(event);
            }
        }
    }
    }

    SwapOrderProducts() {
        this.casesSpinner = true;
        SwapOrderProducts({ OrderProductList: this.oliList, PresentAmendmentQuotetoCustomer : this.PresentAmendmentQuotetoCustomer})
            .then(r => {
                if (r != '' && r != null && !r.startsWith("Error")) {
                    this.casesSpinner = false;
                    console.log('r' + r);
                    window.location.href = '/apex/sbqq__sb?scontrolCaching=1&id=' + r;
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Order Product records were swapped with products sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.open = false;
                    // Dispatches the event.
                    //window.location.reload();

                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: r,
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    SwapOrderProductsNew() {
        this.casesSpinner = true;
        SwapOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r != '' || r != null) {
                    console.log('r' + r);
                    //var url = '/apex/sbqq__sb?scontrolCaching=1&id='+r;
                    window.location.href = '/apex/sbqq__sb?scontrolCaching=1&id=' + r;
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Order Product records were swapped with products sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.displayOne = true;
                    this.displaySec = false;
                    this.displayThird = false;
                    this.selectedStep = 'Step1';
                    this.Amendment = '';
                    //window.open('/apex/sb?scontrolCaching=1&id='+r);
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product records were not swapped with products Sucessfully',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    OnHoldOrderProductsNew() {
        this.casesSpinner = true;
        OnHoldOrderProducts({ OrderProductList: this.oliList })
            .then(r => {
                if (r == true) {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Order Product records were put on Hold Sucessfully',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(event);
                    this.displayOne = true;
                    this.displaySec = false;
                    this.displayThird = false;
                    this.selectedStep = 'Step1';
                    this.Amendment = '';
                } else {
                    this.casesSpinner = false;
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'Order Product records were not put on Hold Sucessfully',
                        variant: 'error',
                        mode: 'sticky'
                    });
                    this.dispatchEvent(event);
                }
            })
    }

    handleNext() {
        console.log('In HandleNext backkkkk');
        this.casesSpinner = true;      
        console.log('this.olilist'+JSON.stringify(this.oliList));
  //your code to be executed after 1 second
  
        console.log('Spinner true');
        console.log('In handleNext' + this.Amendment);
        var getselectedStep = this.selectedStep;
        if (this.Amendment) {
            if (getselectedStep === 'Step1') {
                console.log('In Step1');
                if (this.Amendment != null || this.Amendment != '') {
                    if (this.Amendment == 'Update Start or End Date') {
                        console.log('In UpdateStartEndDate' + this.Amendment);
                        this.UpdateStartEndDate = true;
                        this.OnHold = false;
                        this.ProductSwap = false;
                        this.AddProducts = false;
                        this.FrequencyChange = false;
                        this.ProductSwapPage2 = true;
                        this.ProductSwapPage1 = false;
                        this.PriceChange = false;
                    }
                    if (this.Amendment == 'Billing Hold') {
                        this.UpdateStartEndDate = false;
                        this.OnHold = true;
                        this.ProductSwap = false;
                        this.AddProducts = false;
                        this.FrequencyChange = false;
                        this.ProductSwapPage2 = true;
                        this.ProductSwapPage1 = false;
                        this.PriceChange = false;
                    }
                    if (this.Amendment == 'Product Swap') {
                      //  this.casesSpinner = true;
                        this.UpdateStartEndDate = false;
                        this.OnHold = false;
                        this.ProductSwap = true;
                        this.FrequencyChange = false;
                        this.AddProducts = false;
                        this.ProductSwapPage1 = false;
                        this.ProductSwapPage2 = true;
                        this.PriceChange = false;     
                                         
                    }
                    if (this.Amendment == 'Frequency Change') {
                        this.UpdateStartEndDate = false;
                        this.OnHold = false;
                        this.ProductSwap = false;
                        this.FrequencyChange = true;
                        this.AddProducts = false;
                        this.ProductSwapPage1 = true;
                        this.ProductSwapPage2 = false;
                        this.PriceChange = false;
                    }
                    if (this.Amendment == 'Price Change') {
                        console.log('this.oliList 789' + JSON.stringify(this.oliList));
                        this.PriceChange = true;
                    //    this.casesSpinner = true;
                        this.UpdateStartEndDate = false;
                        this.OnHold = false;
                        this.ProductSwap = false;
                        this.AddProducts = false;
                        this.FrequencyChange = false;
                        this.ProductSwapPage1 = false;
                        this.ProductSwapPage2 = true;
                    }
                    if (this.Amendment == 'Addition') {
                    //    this.casesSpinner = true;
                        this.AddProducts = true;
                        this.PriceChange = false;
                        this.UpdateStartEndDate = false;
                        this.OnHold = false;
                        this.ProductSwap = false;
                        this.FrequencyChange = false;
                    }
                    console.log('In Step 2');
                    this.displayOne = false;
                    this.displaySec = true;
                    this.selectedStep = 'Step2';
                }
            }
            else if (getselectedStep === 'Step2') {
                this.displayOne = false;
                this.displaySec = false;
                this.displayThird = true;
                this.selectedStep = 'Step3';
            }
        }else{
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Please select Amendment Type',
                variant: 'error',
                mode: 'sticky'
            });
            this.dispatchEvent(event);
        }
        /*else if (getselectedStep === 'Step3') {
            this.displayOne = false;
            this.displaySec = false;
            this.displayThird = false;
            this.displayFour = true;
            this.selectedStep = 'Step4';
        
        // }*/
        /*else if (getselectedStep === 'Step4') {
                
        }*/

      
       this.casesSpinner = false;
        console.log('Spinner false');
    }

    handleReplacementDate(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.ReplacementDate = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleReplacementDatee(evt) {
        console.log('value' + evt.target.value);
        this.newOrderStartDate=evt.target.value;
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleFrequencyChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.OPBPFrequency = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleFrequencyChangee(evt) {
        console.log('value' + evt.target.value);
        this.newOrderBillingFrequency=evt.target.value;
        console.log('this.newOrderBillingFrequency' +this.newOrderBillingFrequency);
    }


    handleBillingFrequencyChanges(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.OPBPFrequencies = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleBillingTypeChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.BillingType = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleFixedilledMonthChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.FixedBilledMonth = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleUsageType(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.UsageType = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleOPBPFrequencyChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.OPBPFrequency = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }





    handleNewBusinessChange(evt){
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.BuisnessUnitId = evt.target.value;
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleNewBusinessChangee(evt){
        console.log('value' + evt.target.value);
        this.newOrderBuisnessUnitId= evt.target.value;
        console.log('this.oliList' + JSON.stringify(this.oliList));
        this.CheckOrderProducts();
    }

    CheckOrderProducts(){
        var ProdId=''+this.Product;
        console.log('ProdId--> '+ProdId);
        CheckOrderProducts({ ProductId: ProdId, OrderId:this.recordId,BuisnessUnit:this.newOrderBuisnessUnitId})
        .then(r => {
            this.checkStatus = false;
            console.log('this.recordId --> 1433'+r);
            if (r != '') {
                this.checkStatus = true;
                this.casesSpinner = false;
                console.log('r' + r);
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: r,
                    variant: 'Error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(event);
                this.open = false;
                // Dispatches the event.
                //window.location.reload();
            } 
        })
    }

    handleEffectiveDate(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log('record.Id'+record.Id);               
                record.EffectiveDate = evt.target.value;
                record.PPB_Frequency_Change_Effective_Date__c = evt.target.value;
                console.log('PPB_Frequency_Change_Effective_Date__c'+record.PPB_Frequency_Change_Effective_Date__c );
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleQuantity(evt){
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if(orderproductId == record.Id){
                console.log('record.Id'+record.Id);
                if(evt.target.value != null){
                    record.Quantity = evt.target.value;
                    console.log("Setting quantiy");
                } else {
                    console.log("In the else");
                }
                
            }
        })

    }

    handlePrice(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                record.unitprice = evt.target.value;
                if(evt.target.value!=null){
                record.UnitPriceEntered=true;
                }else{
                    record.UnitPriceEntered=false;
                }
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }

    handleBillableUnitPrice(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log(' evt.target.value'+ evt.target.value);
                record.BillableUnitPrice = evt.target.value;
                console.log(' record.BillableUnitPrice '+ record.BillableUnitPrice );
                if(evt.target.value!=null){
                record.BillableUnitPriceEntered=true;
                }else{
                    record.BillableUnitPriceEntered=false;
                }
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }

    handleAdditionalDiscountAmt(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log(' evt.target.value'+ evt.target.value);
                record.AdditionalDiscAmt = evt.target.value;
                console.log(' record.AdditionalDiscAmt '+ record.AdditionalDiscAmt );
               /* if(evt.target.value!=null){
                record.BillableUnitPriceEntered=true;
                }else{
                    record.BillableUnitPriceEntered=false;
                } */
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }

    handleAdditionalDiscountPer(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log(' evt.target.value'+ evt.target.value);
                record.AdditionalDiscPer = evt.target.value;
                console.log(' record.AdditionalDiscPer '+ record.AdditionalDiscPer);
               /* if(evt.target.value!=null){
                record.BillableUnitPriceEntered=true;
                }else{
                    record.BillableUnitPriceEntered=false;
                } */
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }

    handleMonthlyMinimum(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log(' evt.target.value'+ evt.target.value);
                record.MonthlyMinimum = evt.target.value;
                console.log(' record.MonthlyMinimum '+ record.MonthlyMinimum);
               /* if(evt.target.value!=null){
                record.BillableUnitPriceEntered=true;
                }else{
                    record.BillableUnitPriceEntered=false;
                } */
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }

    handlePriceToIncrease(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log(' evt.target.value'+ evt.target.value);
                record.PriceIncreasetoApply = evt.target.value;
                console.log(' record.PriceIncreasetoApply '+ record.PriceIncreasetoApply);
               /* if(evt.target.value!=null){
                record.BillableUnitPriceEntered=true;
                }else{
                    record.BillableUnitPriceEntered=false;
                } */
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }

    handleBillingFrequency(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                console.log(' evt.target.value'+ evt.target.value);
                record.billingFrequencies = evt.target.value;
                console.log(' record.billingFrequencies '+ record.billingFrequencies );
           /*     if(evt.target.value!=null){
                record.BillableUnitPriceEntered=true;
                }else{
                    record.BillableUnitPriceEntered=false;
                }*/
            }
        })
        console.log('this.oliList 1245' + JSON.stringify(this.oliList));
    }


    handleNewProductChange(evt) {
        //this.casesSpinner=true;
        let self = this
        //this.ProductSwap=f
        var orderproductId = evt.target.name;
        var varproductId = evt.target.value;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                if (evt.target.value != null && evt.target.value != '') {
                    record.NewProduct = evt.target.value;
                }
            }
        })
        if(evt.target.value!=null && evt.target.value!=''){
            getProductOptions({ Product:varproductId})
            .then(r => {
                if (r!=undefined) {
                    console.log('In r'+r);
                    self.oliList.forEach(function (record){
                        if(orderproductId==record.Id){
                                record.OptionList=r;
                                self.casesSpinner=false;
                        }
                    })
                    this.casesSpinner=false;
                }else{
                    self.casesSpinner=false;
                }
            })
        }
        console.log('this.oliList' + JSON.stringify(self.oliList));
    }

    handleDiscountScheduleChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                if (evt.target.value != null && evt.target.value != '') {
                    record.discountscheduleId = evt.target.value;
                    1
                }
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleDiscountPercent(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                if (evt.target.value != null && evt.target.value != '') {
                    record.discountPercent = evt.target.value;
                    1
                }
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleBlockPriceChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                if (evt.target.value != null && evt.target.value != '') {
                    record.blockpriceId = evt.target.value;
                }
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleNewOptionChange(evt) {
        var orderproductId = evt.target.name;
        console.log('orderproductId' + orderproductId);
        console.log('value' + evt.target.value);
        this.oliList.forEach(function (record) {
            if (orderproductId == record.Id) {
                if (evt.target.value != null && evt.target.value != '') {
                    record.optionalProduct = evt.target.value;
                }
            }
        })
        console.log('this.oliList' + JSON.stringify(this.oliList));
    }

    handleProductSwapPageNext() {
        console.log('In handleProductSwapPageNext');

        var ProductSwaperror = false;
        var FrequecyChangeerror = false;
        this.oliList.forEach(function (record) {
            if (((record.NextBillingDate != null && record.ReplacementDate < record.NextBillingDate) || (record.LastBillingDate != null && record.ReplacementDate < record.LastBillingDate) || (record.StartDate != null && record.ReplacementDate < record.StartDate) || record.ReplacementDate==null) && record.isParent==true) {
                ProductSwaperror = true;
            }
            if ((record.NextBillingDate != null && record.EffectiveDate < record.NextBillingDate) || (record.LastBillingDate != null && record.EffectiveDate < record.LastBillingDate) || (record.StartDate != null && record.EffectiveDate < record.StartDate) || record.EffectiveDate==null) {
                console.log('In FrequecyChangeerror true');
                FrequecyChangeerror = true;
            }
        })

        if ((this.Amendment == 'Product Swap' && ProductSwaperror == false) || (this.Amendment == 'Frequency Change' && FrequecyChangeerror == false)) {
            console.log('In ProductSwapPage');
            this.ProductSwapPage1 = false;
            this.ProductSwapPage2 = true;
            console.log('In ProductSwapPage End');
        } else {
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Order Product record Entered Date cannot be less than Next Billing Date, Start Date and Last Billing Date',
                variant: 'error',
                mode: 'sticky'
            });
            this.dispatchEvent(event);
        }
    }

    handlePrev() {
        var getselectedStep = this.selectedStep;
        if (getselectedStep === 'Step2') {
            this.displayOne = true;
            this.displaySec = false;
            this.displayThird = false;
            this.selectedStep = 'Step1';
            this.AddProducts=false;
        }
        else if (getselectedStep === 'Step3') {
            if (this.Amendment == 'Product Swap' || this.Amendment == 'Frequency Change') {
                if (this.ProductSwapPage2 == true) {
                    this.ProductSwapPage2 = false;
                    this.ProductSwapPage1 = true;
                } else {
                    this.displayOne = false;
                    this.displaySec = true;
                    this.displayThird = false;
                    this.displayFour = false;
                    this.selectedStep = 'Step2';
                }
            } else {
                this.displayOne = false;
                this.displaySec = true;
                this.displayThird = false;
                this.displayFour = false;
                this.selectedStep = 'Step2';
            }

        }
        /*else if (getselectedStep === 'Step4') {
            this.displayOne = false;
            this.displaySec = false;
            this.displayThird = true;
            this.displayFour = false;
            this.selectedStep = 'Step3';
        }*/
    }

    handleSave(event) {
        let currentvalue = event.detail.draftValues;
        console.log('currentvalue' + JSON.stringify(currentvalue));
        const self=this;
        self.oliList.forEach(function (oli) {
            currentvalue.forEach(function (currentoli) {
                if (oli.Id == currentoli.Id) {
                    console.log(' oli.TerminatedDate' + oli.TerminatedDate);
                    console.log('oli.StartDate'+oli.StartDate);
                    console.log(' currentoli.TerminatedDate' + currentoli.TerminatedDate);
                    console.log(' currentoli.StartDate' + currentoli.StartDate);
                   // oli.TerminatedDate = currentoli.TerminatedDate;
                    if(currentoli.StartDate != undefined){
                        oli.StartDate = currentoli.StartDate;
                        self.terminationdateEntered=false;
                    }
                    if(currentoli.TerminatedDate != undefined){
                        oli.TerminatedDate = currentoli.TerminatedDate;
                        self.terminationdateEntered=false;
                    }
                    
                    if(oli.isParent==true){
                        self.quoteLineListObj.forEach(record => {
                            if(record.Id==currentoli.Id){
                                if (record._children) {
                                    record._children.forEach(item => {
                                        self.oliList.forEach(function (olli) {
                                            if(olli.Id==item.Id){
                                                
                                                if(currentoli.StartDate != undefined){
                                                    olli.StartDate = currentoli.StartDate;
                                                }
                                                if(currentoli.TerminatedDate != undefined){
                                                    olli.TerminatedDate=currentoli.TerminatedDate;
                                                }
                                            }
                                        })
                                    })
                                }
                            }
                        })
                    }
                }
            });
        });
        //this.oliList=event.detail.draftValues;
        console.log('In Termintion');
        console.log('this.oliList' + JSON.stringify(this.oliList));
   //     this.oliList = this.oliList;
        this.draftValues = [];
    }

    handleSaveOnHold(event) {
        let currentvalue = event.detail.draftValues;
        console.log('currentvalue' + JSON.stringify(currentvalue));
        this.oliList.forEach(function (oli) {
            currentvalue.forEach(function (currentoli) {
                if (oli.Id == currentoli.Id) {
                    console.log(' oli.HoldDate' + oli.HoldDate);
                    console.log(' currentoli.HoldDate' + currentoli.HoldDate);
                    oli.HoldDate = currentoli.HoldDate;
                }
            });
        });
        //this.oliList=event.detail.draftValues;
        console.log('this.oliList' + JSON.stringify(this.oliList));
        this.draftValues2 = [];
    }

    closeModal() {
        console.log("In closeModal");
        this.open = false;
        const closeQA = new CustomEvent('close');
        // Dispatches the event.
        this.dispatchEvent(closeQA);
        window.location.reload();
    }

    updateSelectedRows() {
        debugger;
        console.log('In updateSelectedRows');
        var tempList = [];
        var oliList = [];
        var AmendmentType = this.Amendment;
        var nonselectedrows = [];
       
        var selectRows = this.template.querySelector('lightning-tree-grid').getSelectedRows();
        //console.log('selectRows ====',selectRows[0].Account__c);
        //console.log('selectRows' + JSON.stringify(selectRows));
        //console.log('AmendmentType' + AmendmentType);
        if (selectRows.length > 0) {
            selectRows.forEach(record => {                
                console.log();
                if ((AmendmentType == 'Product Swap' && record.ProductSwapicon == 'standard:first_non_empty' )||(AmendmentType=='Frequency Change' && record.FrequencyChangeicon == 'standard:first_non_empty')||(AmendmentType == 'Price Change' && record.PriceChangeIcon == 'standard:first_non_empty')) {
                    console.log('In nonselected' + AmendmentType);
                    nonselectedrows.push(record.productName);
                } else {
                    tempList.push(record.Id);
                    if (record.isParent == false) {
                        record.SelectedAlone = true;
                    }
                    oliList.push(record);
                }
            })
            console.log('tempList' + tempList);
            console.log('nonselectedrows' + nonselectedrows);
            

            if (nonselectedrows != null && nonselectedrows.length > 0) {
                var Products = '';
                nonselectedrows.forEach(product => {
                    Products = Products + product + ','
                })
                const event = new ShowToastEvent({
                    title: 'Cannot Select following items they are not available for this Amendment Type',
                    message: Products,
                    variant: 'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(event);
            }
            // select and deselect child rows based on header row
            this.quoteLineListObj.forEach(record => {
                // if header was checked and remains checked, do not add sub-rows

                // if header was not checked but is now checked, add sub-rows
                if (!this.currentSelectedRows.includes(record.Id) && tempList.includes(record.Id)) {
                    console.log('If header selected');
                    if (record._children) {
                        record._children.forEach(item => {
                            if (!tempList.includes(item.Id)) {
                                //if(!(AmendmentType=='Product Swap' && item.ProductSwapicon=='standard:first_non_empty')){
                                tempList.push(item.Id);
                                item.SelectedAlone = false;
                                oliList.push(item);
                                //}
                                if (item._children) {
                                    item._children.forEach(itemchild => {
                                        if (!tempList.includes(itemchild.Id)) {
                                            //if(!(AmendmentType=='Product Swap' && itemchild.ProductSwapicon=='standard:first_non_empty')){
                                            tempList.push(itemchild.Id);
                                            itemchild.SelectedAlone = false;
                                            oliList.push(itemchild);
                                            //}
                                        }
                                        
                                    })
                                }
                            }
                        })
                    }
                } else {
                    console.log('In else 1');
                    if (record._children) {
                        record._children.forEach(item => {
                            if (!this.currentSelectedRows.includes(item.Id) && tempList.includes(item.Id)) {
                                if (item._children) {
                                    item._children.forEach(itemchild => {
                                        if (!tempList.includes(itemchild.Id)) {
                                            //if(!(AmendmentType=='Product Swap' && itemchild.ProductSwapicon=='standard:first_non_empty')){
                                            tempList.push(itemchild.Id);
                                            itemchild.SelectedAlone = false;
                                            oliList.push(itemchild);
                                            //}
                                          
                                        }
                                    })
                                }
                            }
                        })
                    }
                }

                // if header was checked and is no longer checked, remove header and sub-rows
                if (this.currentSelectedRows.includes(record.Id) && !tempList.includes(record.Id)) {
                    console.log('remove sub rows');
                    if (record._children) {
                        record._children.forEach(item => {
                            const index = tempList.indexOf(item.Id);
                            if (index > -1) {
                                tempList.splice(index, 1);
                                oliList.splice(index, 1);
                            }
                            if (item._children) {
                                item._children.forEach(itemchild => {
                                    const indexchild = tempList.indexOf(itemchild.Id);
                                    if (indexchild > -1) {
                                        tempList.splice(indexchild, 1);
                                        oliList.splice(indexchild, 1);
                                    }
                                })
                            }
                        })
                    }
                } else {
                    if (record._children) {
                        console.log('In else 2');
                        record._children.forEach(item => {
                            if (this.currentSelectedRows.includes(item.Id) && !tempList.includes(item.Id)) {
                                if (item._children) {
                                    item._children.forEach(itemchild => {
                                        const indexchild = tempList.indexOf(itemchild.Id);
                                        if (indexchild > -1) {
                                            console.log('In remove 1');
                                            tempList.splice(indexchild, 1);
                                            oliList.splice(indexchild, 1);
                                        }
                                    })
                                }
                            }
                        })
                    }
                }

                // if all child rows for the header row are checked, add the header
                // else remove the header (Removed the logic of removing header when all child records are not selected)
                if (record._children) {
                    record._children.forEach(item => {
                        var childallselected = true;
                        if (item._children) {
                            if (item._children.length == 0) {
                                childallselected = false;
                            } else {
                                item._children.forEach(itemchild => {
                                    if (!tempList.includes(itemchild.Id)) {
                                        childallselected = false;
                                    }
                                })
                            }
                        } else {
                            childallselected = false;
                        }
                        if (item._children) {
                            if (item._children.length == 0 && tempList.includes(item.Id)) {
                                tempList.push(item.Id);
                            } else {
                                if (childallselected && !tempList.includes(item.Id)) {
                                    tempList.push(item.Id);
                                } else if (!childallselected && tempList.includes(item.Id)) {
                                    const childindex = tempList.indexOf(item.Id);
                                    if (childindex > -1) {
                                        console.log('In remove 2');
                                        //tempList.splice(childindex, 1);
                                    }
                                }
                            }
                        } else if (tempList.includes(item.Id)) {
                            //if(!(AmendmentType=='Product Swap' && item.ProductSwapicon=='standard:first_non_empty')){
                            tempList.push(item.Id);
                            //oliList.push(item);
                            //}
                        }
                    })
                }
                var allSelected = true;
                if (record._children) {
                    if (record._children.length == 0) {
                        allSelected = false;
                    } else {
                        record._children.forEach(item => {
                            if (!tempList.includes(item.Id)) {
                                allSelected = false;
                            }
                        })
                    }
                } else {
                    allSelected = false;
                }
                if (record._children) {
                    if (record._children.length == 0 && tempList.includes(record.Id)) {
                        tempList.push(record.Id);
                    } else {
                        if (allSelected && !tempList.includes(record.Id)) {
                            tempList.push(record.Id);
                            record.SelectedAlone = false;
                            oliList.push(record);
                        } else if (!allSelected && tempList.includes(record.Id)) {
                            const index = tempList.indexOf(record.Id);
                            if (index > -1) {
                                console.log('In remove 3');
                                //tempList.splice(index, 1);
                            }
                        }
                    }
                } else if (tempList.includes(record.Id)) {
                    tempList.push(record.Id);
                    //oliList.push(record);
                }
            })

            this.selectedRows = tempList;
            this.currentSelectedRows = tempList;
            console.log('oliList' + JSON.stringify(this.oliList));
            this.oliList = oliList;
        }
    }
}