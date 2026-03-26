<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Invoice - {{ $invoice->invoice_number }}</title>
  <style>
    body {
      font-family: 'DejaVu Sans', sans-serif;
      font-size: 12px;
      margin: 0;
      padding: 0;
    }

    .container {
      width: 90%;
      margin: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #ddd;
      padding: 6px;
    }

    th {
      background: #f5f5f5;
      font-weight: bold;
    }

    .text-end {
      text-align: right;
    }

    .no-border td {
      border: none !important;
    }

    .heading {
      background: #0d6efd;
      color: #fff;
      padding: 6px;
      font-size: 14px;
      text-align: center;
    }

    .fw-bold {
      font-weight: bold;
    }

    .fs-14 {
      font-size: 14px;
    }

    .mb-2 {
      margin-bottom: 8px;
    }

    .mt-2 {
      margin-top: 8px;
    }

    .mt-3 {
      margin-top: 12px;
    }

    .border-none {
      border: none !important;
    }
  </style>
</head>

<body>
  <div class="container">

    <!-- Header -->
    <table class="no-border">
      <tr>
        <td style="width: 60%;">
          @if($invoice->business->logo)
          <img src="{{ public_path('storage/' . $invoice->business->logo) }}" height="60">
          @endif
          <h2 class="mb-2">{{ $invoice->business->name }}</h2>
          <div>{{ $invoice->business->address }}</div>
          <div>Phone: {{ $invoice->business->phone }}</div>
          <div>GSTIN: {{ $invoice->business->gst_number }}</div>
        </td>
        <td class="text-end">
          <span class="heading fs-14">TAX INVOICE</span><br><br>
          <strong>Invoice No:</strong> {{ $invoice->invoice_number }}<br>
          <strong>Date:</strong> {{ date('d M Y', strtotime($invoice->invoice_date)) }}
        </td>
      </tr>
    </table>

    <!-- Customer Info -->
    <table class="mt-3">
      <tr>
        <td style="width: 60%;">
          <strong>Bill To:</strong><br>
          {{ $invoice->customer->name }}<br>
          {{ $invoice->customer->phone }}<br>
          @if($invoice->customer->gst_number)
          GSTIN: {{ $invoice->customer->gst_number }}
          @endif
        </td>
        <td>
          <strong>Place of Supply:</strong><br>
          {{ $invoice->business->place_of_supply ?? 'Same State' }}
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="mt-3">
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>HSN / SAC</th>
          <th>Qty</th>
          <th>Rate</th>
          <th>Taxable</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        @foreach($invoice->items as $index => $row)
        <tr>
          <td>{{ $index+1 }}</td>
          <td>{{ $row->product->name }}</td>
          <td>{{ $row->product->hsn_code ?? '' }}</td>
          <td>{{ $row->qty }}</td>
          <td>₹{{ number_format($row->price, 2) }}</td>
          <td>₹{{ number_format($row->qty * $row->price, 2) }}</td>
          <td>₹{{ number_format($row->cgst, 2) }}</td>
          <td>₹{{ number_format($row->sgst, 2) }}</td>
          <td>₹{{ number_format($row->total, 2) }}</td>
        </tr>
        @endforeach
      </tbody>
    </table>

    <!-- Summary -->
    <table class="mt-3">
      <tr>
        <td class="text-end fw-bold">Subtotal:</td>
        <td class="text-end">₹{{ number_format($invoice->total_amount, 2) }}</td>
      </tr>
      @if($invoice->discount_amount > 0)
      <tr>
        <td class="text-end fw-bold">Discount:</td>
        <td class="text-end">-₹{{ number_format($invoice->discount_amount, 2) }}</td>
      </tr>
      @endif
      <tr>
        <td class="text-end fw-bold">Taxable Value:</td>
        <td class="text-end">₹{{ number_format($invoice->taxable_amount, 2) }}</td>
      </tr>
      <tr>
        <td class="text-end fw-bold">CGST + SGST:</td>
        <td class="text-end">₹{{ number_format($invoice->tax_amount, 2) }}</td>
      </tr>
      @if($invoice->shipping_charge > 0)
      <tr>
        <td class="text-end fw-bold">Shipping:</td>
        <td class="text-end">₹{{ number_format($invoice->shipping_charge, 2) }}</td>
      </tr>
      @endif
      <tr>
        <td class="text-end fw-bold">Round Off:</td>
        <td class="text-end">₹{{ number_format($invoice->round_off, 2) }}</td>
      </tr>
      <tr>
        <td class="text-end fw-bold fs-14">Grand Total:</td>
        <td class="text-end fw-bold fs-14">₹{{ number_format($invoice->payable_amount, 2) }}</td>
      </tr>
    </table>

    <!-- Footer Notes -->
    <p class="mt-3 fw-bold">Terms & Conditions:</p>
    <p>- Goods once sold will not be taken back.</p>
    <p>- Subject to jurisdiction of India.</p>

    <table class="no-border mt-3">
      <tr>
        <td style="width: 70%;"></td>
        <td class="text-end">
          <br><br>
          <strong>For {{ $invoice->business->name }}</strong><br><br><br>
          Authorized Signature
        </td>
      </tr>
    </table>

  </div>
</body>

</html>