import React from 'react';
import ReactDOM from 'react-dom';
import Highlight from 'react-highlighter';
import './index.css';
import Products from './products.json';

class FilterableProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            stockedOnly: false
        };

        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
        this.handleStockedOnlyChange = this.handleStockedOnlyChange.bind(this);
    }

    handleSearchTextChange(e) {
        this.setState({
            searchText: e.target.value
        });
    }

    handleStockedOnlyChange(e) {
        this.setState({
            stockedOnly: e.target.checked
        });
    }

    getPoductList(products) {
        if (this.state.searchText) {
            products = products.filter((product) => new RegExp(this.state.searchText, 'i').test(product.name));
        }

        if (this.state.stockedOnly) {
            products = products.filter((product) => product.stocked);
        }

        return products;
    }

    render() {
        let products = this.props.products;

        return (
            <div className="App">
                <SearchBar
                    searchText={this.state.searchText}
                    stockedOnly={this.state.stockedOnly}
                    onSearchTextChange={this.handleSearchTextChange}
                    onStockedOnlyChange={this.handleStockedOnlyChange}/>
                <ProductTable
                    products={this.getPoductList(products)}
                    searchText={this.state.searchText} />
            </div>
        )
    }
}

class SearchBar extends React.Component {
    render() {
        return (
            <form>
                <label htmlFor="searchInput">
                    <span>What are you looking for?</span>
                </label>
                <p>
                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search..."
                        value={this.props.searchText}
                        onChange={this.props.onSearchTextChange}/>
                </p>

                <input
                    type="checkbox"
                    id="inStockInput"
                    checked={this.props.stockedOnly}
                    onChange={this.props.onStockedOnlyChange}/>
                <label htmlFor="inStockInput">
                    <span>Only show products in stock</span>
                </label>
            </form>
        )
    }
}

class ProductTable extends React.Component {
    render() {
        const products = this.props.products;
        const categories = {};
        const rows = [];

        products.forEach((product) => {
            if (!(product.category in categories)) {
                categories[product.category] = [];
            }
            categories[product.category].push(product);
        });

        for (var cat in categories) {
            rows.push(<CategoryRow category={cat} key={cat}/>);
            rows.push(categories[cat].map((product) => {
                return <ProductRow
                    product={product}
                    key={product.name}
                    searchText={this.props.searchText} />
            }));
        }

        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
}

class CategoryRow extends React.Component {
    render() {
        const category = this.props.category;

        return (
            <tr>
                <th colSpan="2">
                    {category}
                </th>
            </tr>
        )
    }
}

class ProductRow extends React.Component {
    render() {
        const product = this.props.product;
        const searchText = this.props.searchText;
        const productPrice = product.price;
        let productName = product.name;

        if (searchText) {
            productName = <Highlight search={searchText} matchElement={'span'} matchStyle={{fontWeight: 'bold'}}>{productName}</Highlight>
        }

        if (!product.stocked) {
            productName = <span style={{color: 'red'}}>{productName}</span>
        }

        return (
            <tr>
                <td>{productName}</td>
                <td>{productPrice}</td>
            </tr>
        )
    }
}

ReactDOM.render(
    <FilterableProductTable products={Products}/>,
    document.getElementById('root')
);

