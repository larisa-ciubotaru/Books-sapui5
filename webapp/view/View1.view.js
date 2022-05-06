sap.ui.define(function() {
    return sap.ui.jsview("ns.projectf2.view.View1", {
        getControllerName: function() {
            return "ns.projectf2.controller.View1"
        },
        createContent: function(oController) {
            return new sap.m.Shell({
                app: new sap.m.App({
                    pages: new sap.m.Page({
                        title: "Books table",
                        content: [
                            new sap.m.VBox({
                                items: [

                                    new sap.m.Table(this.createId("books-table"), {
                                        mode: sap.m.ListMode.SingleSelectMaster,
                                        selectionChange: oController.onTableRowSelected.bind(oController),
                                        headerToolbar: new sap.m.OverflowToolbar({
                                            content: [
                                                new sap.m.Button({
                                                    icon: "sap-icon://sort",
                                                    tooltip: "Sort",
                                                    press: oController.onSortPress.bind(oController)
                                                }),
                                                new sap.m.Button({
                                                    tooltip: "Group",
                                                    icon: "sap-icon://group-2",
                                                    press: oController.onGroupPress.bind(oController)
                                                }),
                                                new sap.m.Button({
                                                    text: "Create",
                                                    press: oController.onCreatePress.bind(oController)
                                                }),
                                                new sap.m.Button({
                                                    text: "User",
                                                    press: oController.onUserPress.bind(oController)
                                                }),
                                                new sap.m.SearchField({
                                                    liveChange: oController.onLiveSearch.bind(oController),
                                                    width: "70%",
                                                    placeholder: "Search a book by title or author"
                                                })
                                            ]
                                        }),
                                        columns: {
                                            path: "/columns",
                                            template: new sap.m.Column({
                                                header: new sap.m.Text({
                                                    text: "{name}"
                                                })
                                            })
                                        },
                                        items: {
                                            path: "/rows",
                                            factory: (id, context) => {
                                                let oRow = context.getProperty();
        
                                                let aCells = Object.values(oRow).map(cell => {
                                                   return  new sap.m.Text({
                                                        text: cell
                                                    })
                                                })
        
                                                return new sap.m.ColumnListItem({
                                                    cells: aCells
                                                })
                                            }
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                })
            })
        }
    })
})

