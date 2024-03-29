import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { toast } from 'react-toastify';
import heroBG from './../assets/heroBG.png';

const HomePage = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useCart();

    //get all cat
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_REACT_API_URL}/api/v1/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, []);

    //get services
    const getAllServices = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${import.meta.env.VITE_REACT_API_URL}/api/v1/service/service-list/${page}`
            );
            setServices(data.services);
            await setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    //getTOtal COunt
    const getTotal = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_REACT_API_URL}/api/v1/service/service-count`);
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    //load more
    const loadMore = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get(
                `${import.meta.env.VITE_REACT_API_URL}/api/v1/service/service-list/${page}`
            );
            setServices([...services, ...data?.services]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // filter by cat
    const handleFilter = (value, id) => {
        setLoading(true);
        let all = [...checked];
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
        setLoading(false);
    };
    useEffect(() => {
        if (!checked.length || !radio.length) getAllServices();
    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterService();
    }, [checked, radio]);

    //get filterd service
    const filterService = async () => {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_REACT_API_URL}/api/v1/service/service-filters`, {
                checked,
                radio,
            });
            setServices(data?.services);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCart = (p) => {
        setCart([...cart, p]);
        toast.success(`${p.name} added to cart`);
        console.log(cart);
    };
    return (
        <Layout title={'ALl Services - Best offers '}>
            <div
                className='hero-area py-5 px-5 px-md-0'
                style={{
                    background: `linear-gradient(to left, #fff1, #fff5), url('${heroBG}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                }}
            >
                <div className='container py-5'>
                    <div className='row'>
                        <div className='col-md-10'>
                            <div className='hero-info pt-5 pt-md-2'>
                                <h5>Helper - On Demand Home Service</h5>
                                <h1 className='fw-bold'>Service at your door</h1>
                                <p style={{ maxWidth: '600px' }}>
                                    We're more than just a home service provider – we're your trusted partner in
                                    transforming your house into a haven.
                                </p>
                            </div>
                        </div>
                        <div className='col-md-2'></div>
                    </div>
                </div>
            </div>
            <div className='service-area'>
                <div className='container py-5'>
                    <div className='row'>
                        <div className='col-md-2 px-4 px-md-0'>
                            <h6 className='fw-semibold cat-heading ps-2 mb-3'>Filter By Category</h6>
                            <div className='d-flex flex-column gap-2 mb-5'>
                                {categories?.map((c) => (
                                    <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                        {c.name}
                                    </Checkbox>
                                ))}
                            </div>
                            {/* price filter */}
                            <h6 className='fw-semibold cat-heading ps-2 mb-3'>Filter By Price</h6>
                            <div className='d-flex flex-column gap-2 mb-4'>
                                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                                    {Prices?.map((p) => (
                                        <div key={p._id} className='pb-2'>
                                            <Radio value={p.array}>{p.name}</Radio>
                                        </div>
                                    ))}
                                </Radio.Group>
                            </div>
                            <div className='d-flex flex-column'>
                                <button
                                    className='btn btn-outline-dark rounded-0 mb-4 mb-md-0'
                                    onClick={() => window.location.reload()}
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                        <div className='col-md-10'>
                            {loading ? (
                                <>loading</>
                            ) : (
                                <div className='container'>
                                    <div className='row'>
                                        {services?.map((p) => (
                                            <div className='col-md-4 mb-4' key={p._id}>
                                                <div className='card m-1 border-0 shadow-lg'>
                                                    <img
                                                        src={`${
                                                            import.meta.env.VITE_REACT_API_URL
                                                        }/api/v1/service/service-photo/${p._id}`}
                                                        className='card-img-top'
                                                        alt={p.name}
                                                    />
                                                    <div className='card-body'>
                                                        <h5 className='card-title'>{p.name}</h5>
                                                        <p className='card-text'>
                                                            {p.description.substring(0, 30)}
                                                            ...
                                                        </p>
                                                        <p className='card-text'>
                                                            Price: <b>{p.price} /=</b>
                                                        </p>
                                                        <div className='d-flex gap-2 flex-column flex-lg-row'>
                                                            <button
                                                                className='btn btn-outline-dark rounded-0'
                                                                onClick={() => navigate(`/service/${p.slug}`)}
                                                            >
                                                                Details
                                                            </button>
                                                            <button
                                                                className='btn btn-dark rounded-0'
                                                                onClick={() => {
                                                                    if (cart.some((item) => item._id === p._id)) {
                                                                        toast.error(`${p.name} already in cart`);
                                                                    } else {
                                                                        setCart([...cart, p]);
                                                                        localStorage.setItem(
                                                                            'cart',
                                                                            JSON.stringify([...cart, p])
                                                                        );
                                                                        toast.success(`${p.name} added to cart`);
                                                                    }
                                                                }}
                                                            >
                                                                Add to cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='text-center mt-4'>
                                        {services && services.length < total && (
                                            <button
                                                className='btn btn-outline-dark rounded-0 py-3 px-5'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setPage(page + 1);
                                                }}
                                            >
                                                <i className='bi bi-arrow-clockwise me-2' />

                                                {loading ? 'Loading ...' : 'Loadmore'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;
