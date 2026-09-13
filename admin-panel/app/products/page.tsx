"use client";

import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "../../lib/firebase";

import AdminShell from "../components/AdminShell";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [editing, setEditing] = useState<string | null>(null);

  const emptyForm = {
    name: "",
    price: "",
    description: "",
    category: "",
    imageUrl: "",
    available: true,
  };

  const [form, setForm] = useState<any>(emptyForm);

  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  // =====================================================
  // LOAD PRODUCTS + CATEGORIES
  // =====================================================

  const load = async () => {
    try {
      const productsSnapshot = await getDocs(
        collection(db, "Products")
      );

      const categoriesSnapshot = await getDocs(
        collection(db, "Categories")
      );

      const productsData = productsSnapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((x: any) => x.price !== undefined);

      const categoriesData = categoriesSnapshot.docs.map(
        (d) => ({
          id: d.id,
          ...d.data(),
        })
      );

      setProducts(productsData);
      setCategories(categoriesData);

    } catch (error) {
      console.error(
        "Error loading products:",
        error
      );

      alert(
        "Could not load products. Check Firebase permissions."
      );
    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    load();
  }, []);


  // =====================================================
  // SET FORM VALUE
  // =====================================================

  const setField = (
    key: string,
    value: any
  ) => {
    setForm((previous: any) => ({
      ...previous,
      [key]: value,
    }));
  };


  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const uploadImage = async (
    file: File | undefined
  ) => {
    if (!file) {
      return;
    }

    // -----------------------------------------------
    // Validate file type
    // -----------------------------------------------

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }


    // -----------------------------------------------
    // Validate file size
    // -----------------------------------------------

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image must be smaller than 5MB."
      );
      return;
    }


    try {
      setUploading(true);
      setUploadProgress(0);


      // ---------------------------------------------
      // Unique file name
      // ---------------------------------------------

      const safeFileName =
        file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_");

      const fileName =
        `${Date.now()}-${safeFileName}`;


      // ---------------------------------------------
      // Firebase Storage reference
      // ---------------------------------------------

      const storageRef = ref(
        storage,
        `products/${fileName}`
      );


      console.log(
        "Starting image upload..."
      );

      console.log(
        "File:",
        file.name
      );

      console.log(
        "Size:",
        file.size
      );

      console.log(
        "Type:",
        file.type
      );


      // ---------------------------------------------
      // RESUMABLE UPLOAD
      // ---------------------------------------------

      const uploadTask =
        uploadBytesResumable(
          storageRef,
          file,
          {
            contentType: file.type,
          }
        );


      // ---------------------------------------------
      // Listen to upload
      // ---------------------------------------------

      await new Promise<void>(
        (resolve, reject) => {

          uploadTask.on(

            "state_changed",

            (snapshot) => {

              const progress =
                Math.round(
                  (
                    snapshot.bytesTransferred /
                    snapshot.totalBytes
                  ) * 100
                );

              console.log(
                `Upload progress: ${progress}%`
              );

              setUploadProgress(
                progress
              );
            },

            (error) => {

              console.error(
                "Firebase Storage upload error:",
                error
              );

              reject(error);
            },

            () => {

              console.log(
                "Image uploaded successfully."
              );

              resolve();
            }

          );

        }
      );


      // ---------------------------------------------
      // Get download URL
      // ---------------------------------------------

      const downloadURL =
        await getDownloadURL(
          uploadTask.snapshot.ref
        );


      console.log(
        "Image URL:",
        downloadURL
      );


      // ---------------------------------------------
      // Save URL in form
      // ---------------------------------------------

      setField(
        "imageUrl",
        downloadURL
      );

      setUploadProgress(100);


    } catch (error: any) {

      console.error(
        "IMAGE UPLOAD FAILED:",
        error
      );

      console.error(
        "Error code:",
        error?.code
      );

      console.error(
        "Error message:",
        error?.message
      );


      alert(
        `Image upload failed.\n\n${
          error?.message ||
          "Unknown Firebase Storage error."
        }`
      );

    } finally {

      setUploading(false);
    }
  };


  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const save = async () => {

    if (!form.name.trim()) {
      alert("Product name is required.");
      return;
    }

    if (!form.price) {
      alert("Price is required.");
      return;
    }

    if (!form.category) {
      alert("Category is required.");
      return;
    }


    // Don't save while image is uploading

    if (uploading) {
      alert(
        "Please wait until the image finishes uploading."
      );
      return;
    }


    try {

      setBusy(true);


      const productData = {
        name: form.name.trim(),

        price: Number(form.price),

        description:
          form.description?.trim() || "",

        category:
          form.category,

        imageUrl:
          form.imageUrl || "",

        available:
          Boolean(form.available),

        updatedAt:
          serverTimestamp(),
      };


      // ---------------------------------------------
      // UPDATE
      // ---------------------------------------------

      if (editing) {

        await updateDoc(
          doc(
            db,
            "Products",
            editing
          ),
          productData
        );

        alert(
          "Product updated successfully ✓"
        );

      }

      // ---------------------------------------------
      // ADD
      // ---------------------------------------------

      else {

        await addDoc(
          collection(
            db,
            "Products"
          ),
          {
            ...productData,

            createdAt:
              serverTimestamp(),
          }
        );

        alert(
          "Product added successfully ✓"
        );
      }


      // ---------------------------------------------
      // RESET
      // ---------------------------------------------

      setForm({
        ...emptyForm,
      });

      setEditing(null);

      await load();


    } catch (error) {

      console.error(
        "Product save error:",
        error
      );

      alert(
        "Could not save product."
      );

    } finally {

      setBusy(false);
    }
  };


  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  const edit = (product: any) => {

    setEditing(
      product.id
    );

    setForm({

      name:
        product.name ||
        product.Name ||
        "",

      price:
        product.price ||
        "",

      description:
        product.description ||
        "",

      category:
        product.category ||
        product.categoryId ||
        "",

      imageUrl:
        product.imageUrl ||
        "",

      available:
        product.available !== false,
    });
  };


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const remove = async (
    id: string
  ) => {

    const confirmed =
      confirm(
        "Delete this product?"
      );

    if (!confirmed) {
      return;
    }


    try {

      await deleteDoc(
        doc(
          db,
          "Products",
          id
        )
      );

      await load();

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        "Could not delete product."
      );
    }
  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setEditing(null);

    setForm({
      ...emptyForm,
    });
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <AdminShell>

      <main className="page">

        <h1>
          Products
        </h1>

        <p className="subtitle">
          Add, edit, remove and control your food products.
        </p>


        {/* ================================================= */}
        {/* PRODUCT FORM */}
        {/* ================================================= */}

        <section className="card">

          <div
            className="row"
          >

            <h2>
              {editing
                ? "Edit Product"
                : "Add New Product"}
            </h2>


            {editing && (

              <button
                className="secondary"
                onClick={
                  cancelEdit
                }
              >
                Cancel Edit
              </button>

            )}

          </div>


          <div
            className="formGrid"
          >

            {/* NAME */}

            <div
              className="field"
            >

              <label>
                Product Name
              </label>

              <input
                value={
                  form.name
                }
                onChange={(e) =>
                  setField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="e.g. Anda Shami"
              />

            </div>


            {/* PRICE */}

            <div
              className="field"
            >

              <label>
                Price (Rs.)
              </label>

              <input
                type="number"
                value={
                  form.price
                }
                onChange={(e) =>
                  setField(
                    "price",
                    e.target.value
                  )
                }
                placeholder="400"
              />

            </div>


            {/* CATEGORY */}

            <div
              className="field"
            >

              <label>
                Category
              </label>

              <select
                value={
                  form.category
                }
                onChange={(e) =>
                  setField(
                    "category",
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category: any) => (

                    <option
                      key={
                        category.id
                      }
                      value={
                        category.name ||
                        category.id
                      }
                    >
                      {
                        category.name ||
                        category.id
                      }
                    </option>

                  )
                )}

              </select>

            </div>


            {/* IMAGE */}

            <div
              className="field"
            >

              <label>
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                disabled={
                  uploading
                }
                onChange={(e) => {

                  const file =
                    e.target.files?.[0];

                  uploadImage(file);

                }}
              />


              {/* UPLOAD STATUS */}

              {uploading && (

                <div
                  style={{
                    marginTop: "8px",
                  }}
                >

                  <small>
                    Uploading image...{" "}
                    {uploadProgress}%
                  </small>


                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      background:
                        "#eee",
                      borderRadius:
                        "10px",
                      marginTop:
                        "6px",
                      overflow:
                        "hidden",
                    }}
                  >

                    <div
                      style={{
                        width:
                          `${uploadProgress}%`,
                        height:
                          "100%",
                        background:
                          "#ff5a1f",
                        transition:
                          "width 0.2s",
                      }}
                    />

                  </div>

                </div>

              )}


              {!uploading &&
                form.imageUrl && (

                  <small
                    style={{
                      color:
                        "green",
                      display:
                        "block",
                      marginTop:
                        "8px",
                    }}
                  >
                    Image uploaded ✓
                  </small>

                )}

            </div>


            {/* DESCRIPTION */}

            <div
              className="field full"
            >

              <label>
                Description
              </label>

              <textarea
                value={
                  form.description
                }
                onChange={(e) =>
                  setField(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Describe the food..."
              />

            </div>

          </div>


          {/* AVAILABLE */}

          <label
            style={{
              display:
                "flex",
              gap:
                8,
              alignItems:
                "center",
              margin:
                "8px 0 16px",
            }}
          >

            <input
              type="checkbox"
              checked={
                form.available
              }
              onChange={(e) =>
                setField(
                  "available",
                  e.target.checked
                )
              }
            />

            Available / In Stock

          </label>


          {/* SAVE BUTTON */}

          <button
            className="primary"
            disabled={
              busy ||
              uploading
            }
            onClick={
              save
            }
          >

            {uploading
              ? `Uploading Image ${uploadProgress}%...`
              : busy
              ? "Saving..."
              : editing
              ? "Update Product"
              : "Add Product"}

          </button>

        </section>


        {/* ================================================= */}
        {/* PRODUCTS LIST */}
        {/* ================================================= */}

        <section
          className="card"
        >

          <h2>
            Menu
          </h2>


          {products.length === 0 ? (

            <p>
              No products found.
            </p>

          ) : (

            products.map(
              (product: any) => (

                <div
                  className="listItem"
                  key={
                    product.id
                  }
                >

                  {/* IMAGE */}

                  {product.imageUrl ? (

                    <img
                      className="thumb"
                      src={
                        product.imageUrl
                      }
                      alt={
                        product.name ||
                        "Product"
                      }
                    />

                  ) : (

                    <div
                      className="thumb"
                    />

                  )}


                  {/* INFO */}

                  <div
                    className="info"
                  >

                    <h3>
                      {
                        product.name ||
                        product.Name
                      }
                    </h3>

                    <p>
                      {
                        product.category ||
                        product.categoryId
                      }

                      {" · Rs. "}

                      {
                        product.price
                      }
                    </p>


                    <span
                      className={
                        `badge ${
                          product.available === false
                            ? "red"
                            : "green"
                        }`
                      }
                    >

                      {product.available === false
                        ? "Out of stock"
                        : "Available"}

                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div
                    className="actions"
                  >

                    <button
                      className="secondary"
                      onClick={() =>
                        edit(product)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="danger"
                      onClick={() =>
                        remove(
                          product.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )

          )}

        </section>

      </main>

    </AdminShell>
  );
}