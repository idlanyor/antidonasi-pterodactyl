@extends('layouts.admin')

@section('title')
    Store
@endsection

@section('content-header')
    <h1>Store<small>Kelola produk game server yang dijual.</small></h1>
    <ol class="breadcrumb">
        <li><a href="{{ route('admin.index') }}">Admin</a></li>
        <li class="active">Store</li>
    </ol>
@endsection

@section('content')
    <div class="row">
        <div class="col-xs-12">
            <div class="box box-primary">
                <div class="box-header with-border">
                    <h3 class="box-title">Produk</h3>
                    <div class="box-tools">
                        <a href="{{ route('admin.store.settings') }}" class="btn btn-sm btn-warning">Gateway Settings</a>
                        <a href="{{ route('admin.store.new') }}" class="btn btn-sm btn-primary">Buat Produk</a>
                    </div>
                </div>
                <div class="box-body table-responsive no-padding">
                    <table class="table table-hover">
                        <tr>
                            <th>Nama</th>
                            <th>Harga</th>
                            <th>Spec</th>
                            <th>Node</th>
                            <th>Egg</th>
                            <th>Aktif</th>
                            <th></th>
                        </tr>
                        @foreach($products as $product)
                            <tr>
                                <td>{{ $product->name }}</td>
                                <td>RM {{ number_format($product->price / 100, 2) }}</td>
                                <td>{{ $product->memory }} MB · {{ $product->cpu }}% · {{ $product->disk }} MB</td>
                                <td>{{ $product->node->name ?? '—' }}</td>
                                <td>{{ $product->egg->name ?? '—' }}</td>
                                <td>
                                    @if($product->active)
                                        <span class="label label-success">Aktif</span>
                                    @else
                                        <span class="label label-default">Nonaktif</span>
                                    @endif
                                </td>
                                <td>
                                    <a href="{{ route('admin.store.edit', $product->id) }}" class="btn btn-xs btn-primary">Edit</a>
                                    <a href="#" data-action="delete-product" data-id="{{ $product->id }}" class="btn btn-xs btn-danger">
                                        <i class="fa fa-trash-o"></i>
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                        @if($products->isEmpty())
                            <tr>
                                <td colspan="7" class="text-center text-muted">Belum ada produk. Klik "Buat Produk" untuk menambahkan.</td>
                            </tr>
                        @endif
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('footer-scripts')
    @parent
    <script>
        $(document).ready(function() {
            $('[data-action="delete-product"]').click(function (event) {
                var self = $(this);
                event.preventDefault();
                swal({
                    type: 'error',
                    title: 'Hapus Produk',
                    text: 'Produk store akan dihapus permanen. Lanjutkan?',
                    showCancelButton: true,
                    allowOutsideClick: true,
                    closeOnConfirm: false,
                    confirmButtonText: 'Hapus',
                    confirmButtonColor: '#d9534f',
                    showLoaderOnConfirm: true
                }, function () {
                    $.ajax({
                        method: 'DELETE',
                        url: '/admin/store/view/' + self.data('id'),
                        headers: {
                            'X-CSRF-TOKEN': '{{ csrf_token() }}'
                        }
                    }).done(function () {
                        swal({
                            type: 'success',
                            title: '',
                            text: 'Produk telah dihapus.'
                        });
                        window.location.reload();
                    }).fail(function (jqXHR) {
                        console.error(jqXHR);
                        swal({
                            type: 'error',
                            title: 'Whoops!',
                            text: 'Gagal menghapus produk.'
                        });
                    });
                });
            });
        });
    </script>
@endsection
