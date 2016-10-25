var Company = React.createClass({

render: function()
{
    var styles = {width:"50px",height:"50px"};
   return (
            <center><img src={this.props.src}/></center>
       );
}
});

CompanyList = React.createClass({displayName:"CompanyList",
    render: function(){

    var companyNodes = this.props.companies.map(function(comp)
        {
            return(
                <Company key={comp.key} url={comp.url}>
                </Company>
            );
        });
    return(
                <div className={"noselect"}>
                    {companyNodes}
                </div>
            );
    }
});
$.ajax({dataType:"json",url:"companies.json",success:function(data){
    if(!window.mobile)
    {
        ReactDOM.render((
        <CompanyList companies={data} />
        ),document.getElementById("cover"));
    }
}});
