import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { request } from '../../../../services/utilities';
import { USER_COOKIE } from '../../../../services/constants';
import SSRStorage from '../../../../services/storage';
import { LoaderGrow } from '../../../AdvanceUi/Loader/loader';
import { Store } from '../../../../services/store';
import HeaderIndex from '../Admin/Layout';

import ReactPaginate from "react-paginate";
import { Link, useParams } from 'react-router-dom';
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Table, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import logoLight from "../../../../assets/images/odorbnlogo.png";

import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

// import {Loa}

function ViewOpticianOptometrist() {

    const [loading, setLoading] = useState(false);
    const [practices, setPractices] = useState(null);


    const handleError = () => {
        return MySwal.fire({
            text: `Failed to fetch ${type.type}`,
            icon: 'error',
            showConfirmButton: false,
            timer: 2000
        })
    }

    const id = useParams();
    const type = useParams();

    const fetchPractices = useCallback(async () => {
        const url = `${type.type}s/${id.id}`;
        try {
            setLoading(true);
            const rs = await request(url, 'GET', true);
            setPractices(rs?.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.message === 'No record') {
                return setPractices(null);
            }
            console.log(err);
        }
    }, [id.id, type.type]);

    useEffect(() => {
        fetchPractices();
    }, [fetchPractices]);

    // const count = Number((meta.total / rowsPerPage).toFixed(0))

    return (
        <>
            <div className='w-100'>
                <HeaderIndex />
            </div>
            <div className="page-content mt-5">
                <div className="container-fluid p-5">
                    <div className="row">
                        <>{loading === true ? <LoaderGrow /> : ''}</>

                        <div className="align-items-start card" style={{ background: '#05B604' }}>
                            <div className="col-sm-8 w-100">
                                <div className="p-3 row justify-content-between">
                                    <Col>
                                        <p className="fs-16 lh-base text-white fw-semibold"> License History For {practices?.user !== null ? practices?.user?.firstName : practices?.i_name || '--'} {practices?.user?.surname || '-- '}
                                            with id. no. {id.id || '--'}
                                        </p>
                                    </Col>
                                    <Col lg={4}>
                                        <img
                                            src={logoLight}
                                            className="card-logo card-logo-dark"
                                            alt="logo dark"
                                            height="70"
                                            width='100%'
                                        />
                                        <img
                                            src={logoLight}
                                            className="card-logo card-logo-light"
                                            alt="logo light"
                                            height="70"
                                            width='100%'

                                        />
                                    </Col>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="card">
                                <Row className='align-items-center'>
                                    <Col>
                                        <h4 className="card-title mb-0 text-capitalize p-4">Registered {type.type}</h4>

                                    </Col>
                                </Row>

                                <div className="card-body pt-4 table-responsive">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Practice Name</th>
                                                <th scope="col">Verified Date</th>
                                                <th scope="col">User Status</th>
                                                <th scope="col">Is Recommended</th>
                                                <th scope="col">Approval</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {practices !== null ? <tr>
                                                <th scope="row"><Link to="#" className="fw-medium">{`1`}</Link></th>
                                                <td>{practices?.user !== null ? practices?.user?.firstName : practices?.i_name || '--'}</td>
                                                <td>{practices?.isApprovedByAdmin === true ? new Date(practices?.admin_odorbn?.createdAt).toDateString() : '--'}</td>
                                                <td>{practices?.status !== "approved" ? <span className="ri-close-circle-line align-middle text-danger"><span className='text-dark mx-1'>{practices?.status}</span></span> :
                                                    <span className="ri-checkbox-circle-line align-middle text-success"><span className='mx-1'>{practices?.status}</span></span>
                                                }
                                                </td>
                                                <td>{practices?.isApprovedByAdmin !== true ? 'False' : 'True'}</td>
                                                <td>{practices?.isApprovedByAdmin !== true ? 'Unapproved' : 'Approved'}</td>
                                            </tr > : ''}
                                        </tbody>
                                    </Table>

                                    <div className="align-items-center mt-2 d-flex justify-content-between">
                                        <Link to='/'>
                                            <div className="">
                                                <button className="btn text-white" style={{ background: '#05B604' }}>
                                                    Go Back
                                                </button>
                                            </div>
                                        </Link>
                                        <div className="text-muted">Available Results <span className="fw-semibold">
                                            {'1'}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ViewOpticianOptometrist;