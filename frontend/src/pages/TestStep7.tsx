import React from 'react';

const TestStep7: React.FC = () => {
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        }}>
            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '20px'
                    }}>
                        🎉
                    </div>
                    <h1 style={{
                        color: '#2563eb',
                        fontSize: '28px',
                        marginBottom: '10px'
                    }}>
                        Your Move is Booked!
                    </h1>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '16px'
                    }}>
                        Thank you for choosing MovedIn 2.0
                    </p>
                </div>

                <div style={{
                    background: '#d1fae5',
                    border: '1px solid #10b981',
                    color: '#065f46',
                    padding: '15px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '25px'
                }}>
                    ✅ Payment Completed Successfully - $1.00 CAD
                </div>

                <div style={{
                    marginBottom: '25px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        color: '#374151',
                        marginBottom: '15px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>
                        📍 Move Details
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                From
                            </div>
                            <div style={{ color: '#6b7280' }}>
                                Toronto, ON
                            </div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                To
                            </div>
                            <div style={{ color: '#6b7280' }}>
                                Vancouver, BC
                            </div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Date
                            </div>
                            <div style={{ color: '#6b7280' }}>
                                February 1, 2025
                            </div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Time
                            </div>
                            <div style={{ color: '#6b7280' }}>
                                Morning
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginBottom: '25px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        color: '#374151',
                        marginBottom: '15px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>
                        🏠 Home Details
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Rooms
                            </div>
                            <div style={{ color: '#6b7280' }}>3</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Square Feet
                            </div>
                            <div style={{ color: '#6b7280' }}>1,500</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Weight
                            </div>
                            <div style={{ color: '#6b7280' }}>2,000 lbs</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Bedrooms
                            </div>
                            <div style={{ color: '#6b7280' }}>2</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Bathrooms
                            </div>
                            <div style={{ color: '#6b7280' }}>2</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Heavy Items
                            </div>
                            <div style={{ color: '#6b7280' }}>Piano, Safe</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginBottom: '25px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        color: '#374151',
                        marginBottom: '15px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>
                        👤 Contact Information
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Name
                            </div>
                            <div style={{ color: '#6b7280' }}>Sagi Shkolnik</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Email
                            </div>
                            <div style={{ color: '#6b7280' }}>support@movedin.com</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Phone
                            </div>
                            <div style={{ color: '#6b7280' }}>416-555-0123</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginBottom: '25px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        color: '#374151',
                        marginBottom: '15px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>
                        🚚 Moving Company
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Company
                            </div>
                            <div style={{ color: '#6b7280' }}>Lets Get Moving</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Total Cost
                            </div>
                            <div style={{ color: '#6b7280' }}>$1.00 CAD</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Estimated Hours
                            </div>
                            <div style={{ color: '#6b7280' }}>4 hours</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Travel Time
                            </div>
                            <div style={{ color: '#6b7280' }}>30 minutes</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Crew Size
                            </div>
                            <div style={{ color: '#6b7280' }}>2 people</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Truck Size
                            </div>
                            <div style={{ color: '#6b7280' }}>Medium</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginBottom: '25px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                }}>
                    <h3 style={{
                        color: '#374151',
                        marginBottom: '15px',
                        borderBottom: '2px solid #e5e7eb',
                        paddingBottom: '8px'
                    }}>
                        💰 Payment Details
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '15px'
                    }}>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Amount
                            </div>
                            <div style={{ color: '#6b7280' }}>$1.00 CAD</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Status
                            </div>
                            <div style={{ color: '#6b7280' }}>✅ Completed</div>
                        </div>
                        <div style={{
                            background: 'white',
                            padding: '12px',
                            borderRadius: '6px',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#374151',
                                marginBottom: '5px'
                            }}>
                                Payment ID
                            </div>
                            <div style={{ color: '#6b7280' }}>pi_test_direct</div>
                        </div>
                    </div>
                </div>

                <div style={{
                    textAlign: 'center',
                    marginTop: '30px'
                }}>
                    <button 
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                        onClick={() => window.location.href = '/'}
                    >
                        Back to Home
                    </button>
                    <button 
                        style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            margin: '10px'
                        }}
                        onClick={() => window.location.href = '/#/step7'}
                    >
                        Try Real Step7
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestStep7;
